from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    openid = db.Column(db.String(100), unique=True, nullable=False)
    nickname = db.Column(db.String(100))
    avatar = db.Column(db.String(255))
    role = db.Column(db.String(20), nullable=False, default='customer')  # customer 或 merchant
    create_time = db.Column(db.DateTime, default=datetime.now)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now)
    dishes = db.relationship('Dish', backref='category', lazy=True)

class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dish.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    create_time = db.Column(db.DateTime, default=datetime.now)
    dish = db.relationship('Dish', backref='carts', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='待支付')
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now)
    pay_time = db.Column(db.DateTime)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dish.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    order = db.relationship('Order', backref='items', lazy=True)
    dish = db.relationship('Dish', backref='order_items', lazy=True)
