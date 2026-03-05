import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mini_program.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT配置
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-jwt-secret-key'
    JWT_EXPIRATION = 86400  # 24小时
    
    # 微信支付配置
    APPID = 'your-appid'
    MCHID = 'your-mchid'
    API_KEY = 'your-api-key'
    NOTIFY_URL = 'http://your-server.com/api/pay/notify'
