from flask import request, jsonify, session
from app import app, db
from models.models import Category, Dish, Cart, Order, OrderItem, User
import random
import string
from datetime import datetime
import jwt
import time

# 统一返回格式
def success_response(data=None, msg="操作成功"):
    return jsonify({
        "code": 200,
        "msg": msg,
        "data": data
    })

def error_response(code=400, msg="操作失败"):
    return jsonify({
        "code": code,
        "msg": msg,
        "data": None
    }), code

# 角色验证装饰器
def requires_role(role):
    def decorator(f):
        def decorated_function(*args, **kwargs):
            # 从请求头获取token
            token = request.headers.get('Authorization')
            if not token:
                return error_response(401, "请先登录")
            
            try:
                # 验证token
                decoded = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                user_id = decoded.get('user_id')
                user_role = decoded.get('role')
                
                if not user_id or not user_role:
                    return error_response(401, "无效的token")
                
                # 检查角色权限
                if user_role != role:
                    return error_response(403, "权限不足")
                
                # 将用户信息保存到请求上下文
                request.user_id = user_id
                request.user_role = user_role
                
            except jwt.ExpiredSignatureError:
                return error_response(401, "token已过期")
            except jwt.InvalidTokenError:
                return error_response(401, "无效的token")
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# 生成订单号
def generate_order_number():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    return f'{timestamp}{random_str}'

# 菜品分类接口
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    data = [{
        'id': c.id,
        'name': c.name,
        'create_time': c.create_time
    } for c in categories]
    return success_response(data, "获取分类成功")

@app.route('/api/categories', methods=['POST'], endpoint='add_category')
@requires_role('merchant')
def add_category():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return error_response(400, "分类名称不能为空")
    
    # 检查分类名称是否已存在
    existing_category = Category.query.filter_by(name=name).first()
    if existing_category:
        return error_response(400, "分类名称已存在")
    
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return success_response({'id': category.id, 'name': category.name}, "分类添加成功")

@app.route('/api/categories/<int:id>', methods=['DELETE'], endpoint='delete_category')
@requires_role('merchant')
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return error_response(404, "分类不存在")
    
    # 检查是否有菜品属于该分类
    if category.dishes:
        return error_response(400, "该分类下有菜品，无法删除")
    
    db.session.delete(category)
    db.session.commit()
    return success_response(None, "分类删除成功")

# 菜品接口
@app.route('/api/dishes', methods=['GET'], endpoint='get_dishes')
def get_dishes():
    category_id = request.args.get('category_id')
    if category_id:
        dishes = Dish.query.filter_by(category_id=category_id).all()
    else:
        dishes = Dish.query.all()
    
    data = [{
        'id': d.id,
        'name': d.name,
        'price': d.price,
        'description': d.description,
        'image': d.image,
        'category_id': d.category_id
    } for d in dishes]
    return success_response(data, "获取菜品成功")

@app.route('/api/dishes', methods=['POST'], endpoint='add_dish')
@requires_role('merchant')
def add_dish():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    category_id = data.get('category_id')
    
    if not name or not price or not category_id:
        return error_response(400, "菜品名称、价格和分类不能为空")
    
    dish = Dish(
        name=name,
        price=price,
        description=data.get('description'),
        image=data.get('image'),
        category_id=category_id
    )
    db.session.add(dish)
    db.session.commit()
    return success_response({'id': dish.id, 'name': dish.name}, "菜品添加成功")

@app.route('/api/dishes/<int:id>', methods=['DELETE'], endpoint='delete_dish')
@requires_role('merchant')
def delete_dish(id):
    dish = Dish.query.get(id)
    if not dish:
        return error_response(404, "菜品不存在")
    
    db.session.delete(dish)
    db.session.commit()
    return success_response(None, "菜品删除成功")

# 购物车接口
@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    dish_id = data.get('dish_id')
    quantity = data.get('quantity', 1)
    
    if not user_id or not dish_id:
        return error_response(400, "用户ID和菜品ID不能为空")
    
    # 检查购物车中是否已有该菜品
    cart_item = Cart.query.filter_by(user_id=user_id, dish_id=dish_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(user_id=user_id, dish_id=dish_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    return success_response(None, "添加购物车成功")

@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    data = [{
        'id': item.id,
        'dish_id': item.dish_id,
        'name': item.dish.name,
        'price': item.dish.price,
        'quantity': item.quantity,
        'image': item.dish.image
    } for item in cart_items]
    return success_response(data, "获取购物车成功")

# 订单接口
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    user_id = data.get('user_id')
    items = data.get('items')
    
    if not user_id or not items:
        return error_response(400, "用户ID和订单商品不能为空")
    
    total_price = 0
    order_items = []
    
    for item in items:
        dish = Dish.query.get(item['dish_id'])
        if not dish:
            return error_response(404, f"菜品ID {item['dish_id']} 不存在")
        
        item_price = dish.price * item['quantity']
        total_price += item_price
        order_items.append({
            'dish_id': dish.id,
            'quantity': item['quantity'],
            'price': dish.price
        })
    
    # 创建订单
    order_number = generate_order_number()
    order = Order(
        user_id=user_id,
        total_price=total_price,
        order_number=order_number,
        status='已支付',  # 直接设置为已支付
        pay_time=datetime.now()  # 设置支付时间
    )
    db.session.add(order)
    db.session.flush()  # 获取订单ID
    
    # 添加订单商品
    for item in order_items:
        order_item = OrderItem(
            order_id=order.id,
            dish_id=item['dish_id'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    data = {
        'order_id': order.id,
        'order_number': order_number,
        'total_price': total_price,
        'status': order.status
    }
    return success_response(data, "订单创建成功")

# 用户登录/注册接口
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        openid = data.get('openid')
        nickname = data.get('nickname')
        avatar = data.get('avatar')
        role = data.get('role', 'customer')  # 默认为顾客
        
        if not openid:
            return jsonify({'error': 'openid 不能为空'}), 400
        
        # 查找或创建用户
        user = User.query.filter_by(openid=openid).first()
        if not user:
            user = User(openid=openid, nickname=nickname, avatar=avatar, role=role)
            db.session.add(user)
            db.session.commit()
        else:
            # 更新用户信息
            if nickname:
                user.nickname = nickname
            if avatar:
                user.avatar = avatar
            if role:
                user.role = role
            db.session.commit()
        
        # 生成token
        payload = {
            'user_id': user.id,
            'role': user.role,
            'exp': int(time.time()) + app.config['JWT_EXPIRATION']
        }
        token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        data = {
            'id': user.id,
            'nickname': user.nickname,
            'avatar': user.avatar,
            'role': user.role,
            'token': token
        }
        return success_response(data, "登录成功")
    except Exception as e:
        print(f'登录错误: {str(e)}')
        return error_response(500, str(e))

# 获取当前用户信息
@app.route('/api/user', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return error_response(401, "请先登录")
    
    user = User.query.get(user_id)
    if not user:
        return error_response(404, "用户不存在")
    
    data = {
        'id': user.id,
        'nickname': user.nickname,
        'avatar': user.avatar,
        'role': user.role
    }
    return success_response(data, "获取用户信息成功")

# 登出接口
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return success_response(None, "登出成功")




