# -*- coding: utf-8 -*-
from app import app, db
from models.models import User, Category, Dish, Cart, Order, OrderItem

if __name__ == '__main__':
    # 创建数据库表
    db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
