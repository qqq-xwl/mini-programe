# 小程序和服务端部署操作手册

## 一、服务器平台推荐

### 推荐平台：
1. **腾讯云轻量应用服务器** - 推荐指数：⭐⭐⭐⭐⭐
   - 优点：性价比高，适合小程序后端，新用户有优惠
   - 价格：最低99元/年（2核2G）
   - 适合：中小型应用，流量适中

2. **阿里云轻量应用服务器** - 推荐指数：⭐⭐⭐⭐
   - 优点：稳定可靠，国内访问速度快
   - 价格：最低108元/年（2核2G）
   - 适合：企业级应用，需要高可靠性

3. **华为云弹性云服务器** - 推荐指数：⭐⭐⭐⭐
   - 优点：性能稳定，安全可靠
   - 价格：最低120元/年（2核2G）
   - 适合：对安全性要求高的应用

### 选择建议：
- 预算有限：腾讯云轻量应用服务器
- 追求稳定：阿里云轻量应用服务器
- 安全性要求高：华为云弹性云服务器

## 二、服务端部署步骤

### 步骤1：购买服务器
1. 访问[腾讯云官网](https://cloud.tencent.com/)
2. 注册/登录账号
3. 进入"产品" -> "轻量应用服务器"
4. 选择"新用户专享"套餐
5. 配置选择：
   - 镜像：CentOS 7.6+
   - CPU：2核
   - 内存：2GB
   - 存储：40GB SSD
   - 带宽：3Mbps
   - 时长：1年
6. 完成支付，获取服务器IP和登录密码

### 步骤2：服务器环境配置
1. **连接服务器**：
   - 使用SSH工具（如PuTTY、Xshell）
   - 输入服务器IP、用户名（root）和密码
   - 登录服务器

2. **推荐的免费服务器可视化工具**：
   - **MobaXterm**（推荐）
     - 特点：功能强大的集成终端工具，支持SSH、VNC、RDP、FTP等多种协议，免费版足够日常使用
     - 适用系统：Windows
     - 下载地址：[MobaXterm官网](https://mobaxterm.mobatek.net/)
     - 使用步骤：
       1. 下载并安装MobaXterm
       2. 打开软件，点击"Session" -> "SSH"
       3. 输入服务器IP、用户名（如root），点击"OK"
       4. 输入服务器密码，即可连接

   - **FinalShell**
     - 特点：国产免费工具，界面友好，支持SSH、SFTP、远程桌面等
     - 适用系统：Windows、Mac、Linux
     - 下载地址：[FinalShell官网](http://www.hostbuf.com/)

   - **Windows远程桌面（RDP）**
     - 特点：Windows系统自带，无需额外安装，适合Windows服务器
     - 服务器配置（CentOS为例）：
       ```bash
       yum install -y epel-release
       yum install -y xrdp tigervnc-server
       systemctl start xrdp
       systemctl enable xrdp
       firewall-cmd --add-port=3389/tcp --permanent
       firewall-cmd --reload
       ```

   - **Putty + Xming**
     - 特点：轻量级组合，Putty负责SSH连接，Xming负责图形界面转发
     - 适用系统：Windows

   - **VNC Viewer**
     - 特点：专注于VNC协议，轻量高效
     - 适用系统：Windows、Mac、Linux
     - 服务器配置（CentOS为例）：
       ```bash
       yum install -y tigervnc-server
       vncpasswd
       vncserver :1
       firewall-cmd --add-port=5901/tcp --permanent
       firewall-cmd --reload
       ```

3. **更新系统**：
   ```bash
   yum update -y
   ```

4. **安装Python 3.8**：
   ```bash
   yum install -y python3 python3-pip python3-devel
   ```

5. **安装Git**：
   ```bash
   yum install -y git
   ```

6. **安装数据库（可选）**：
   - SQLite：系统已自带
   - MySQL（推荐）：
     ```bash
     yum install -y mariadb mariadb-server
     systemctl start mariadb
     systemctl enable mariadb
     mysql_secure_installation
     ```

### 步骤3：部署服务端代码
1. **克隆代码**：
   ```bash
   cd /home
   git clone <你的代码仓库地址>
   cd mini_program_server
   ```

2. **安装依赖**：
   - **推荐：使用虚拟环境**（避免权限问题和依赖冲突）：
     ```bash
     # 步骤1：更新系统和安装编译依赖
     yum update -y
     yum install -y gcc gcc-c++ python3-devel make python3-venv
     
     # 步骤2：创建虚拟环境
     python3 -m venv venv
     
     # 步骤3：激活虚拟环境
     source venv/bin/activate
     
     # 步骤4：升级pip
     pip install --upgrade pip
     
     # 步骤5：安装项目依赖（使用国内镜像加速）
     pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
     ```
   - **直接安装（不推荐，可能导致权限问题）**：
     ```bash
     # 步骤1：更新系统和安装编译依赖
     yum update -y
     yum install -y gcc gcc-c++ python3-devel make
     
     # 步骤2：升级pip
     pip3 install --upgrade pip
     
     # 步骤3：安装项目依赖
     pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
     ```
   - **常见问题解决**：
     - **greenlet安装失败**：
       ```bash
       # 方法1：强制重新编译安装
       pip install --no-binary :all: greenlet
       # 方法2：指定版本
       pip install greenlet==1.1.2
       ```
     - **其他依赖安装失败**：
       ```bash
       # 逐个安装依赖
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple Flask==2.0.1
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple Flask-SQLAlchemy==2.5.1
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple Flask-CORS==3.0.10
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple PyJWT==2.1.0
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple Werkzeug==2.0.1
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests==2.26.0
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple wechatpy==1.8.18
       pip install -i https://pypi.tuna.tsinghua.edu.cn/simple SQLAlchemy==1.4.46
       ```

3. **配置文件修改**：
   - 编辑 `config/config.py`：
     ```bash
     vi config/config.py
     ```
     修改：
     - SECRET_KEY：生成随机字符串
     - JWT_SECRET_KEY：生成随机字符串
     - 数据库配置（如果使用MySQL）

4. **启动服务**：
   - **使用虚拟环境启动**：
     - 开发环境：
       ```bash
       # 激活虚拟环境
       source venv/bin/activate
       # 启动服务
       python run.py
       ```
     - 生产环境（推荐）：
       ```bash
       # 激活虚拟环境
       source venv/bin/activate
       # 安装gunicorn
       pip install gunicorn
       # 启动服务
       gunicorn -w 4 -b 0.0.0.0:5000 app:app --daemon
       ```
   - **直接启动（不使用虚拟环境）**：
     - 开发环境：
       ```bash
       python3 run.py
       ```
     - 生产环境：
       ```bash
       pip3 install gunicorn
       gunicorn -w 4 -b 0.0.0.0:5000 app:app --daemon
       ```

5. **配置防火墙**：
   - **步骤1：检查并启动FirewallD服务**：
     ```bash
     # 检查FirewallD状态
     systemctl status firewalld
     
     # 启动FirewallD服务
     systemctl start firewalld
     
     # 设置FirewallD开机自启
     systemctl enable firewalld
     ```
   - **步骤2：添加端口规则**：
     ```bash
     firewall-cmd --zone=public --add-port=5000/tcp --permanent
     firewall-cmd --reload
     ```
   - **步骤3：验证端口是否开放**：
     ```bash
     firewall-cmd --list-ports
     ```

### 步骤4：域名配置（可选）
1. **购买域名**：在腾讯云/阿里云购买域名
2. **域名解析**：将域名解析到服务器IP
3. **SSL证书**：申请免费SSL证书，配置HTTPS

## 三、小程序部署步骤

### 步骤1：微信小程序后台配置
1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 点击"立即注册"，选择"小程序"
3. 填写小程序信息，获取AppID
4. 进入"开发" -> "开发设置"
5. 在"服务器域名"中添加：
   - request合法域名：`https://你的域名`（或服务器IP）
   - socket合法域名：（如需要）
   - uploadFile合法域名：（如需要）
   - downloadFile合法域名：（如需要）

### 步骤2：修改小程序代码
1. 打开`native-mini-program`目录
2. 编辑 `app.js`：
   - 修改 `baseUrl` 为你的服务器地址

3. 编辑所有页面中的API地址：
   - 将 `http://10.168.5.20:5000/api` 替换为你的服务器地址

### 步骤3：上传和发布
1. 在微信开发者工具中打开项目
2. 点击"上传"按钮
3. 填写版本号和更新日志
4. 点击"提交审核"
5. 审核通过后，点击"发布"按钮上线

## 四、维护和监控

### 1. 日志管理
- 查看Gunicorn日志：
  ```bash
  tail -f /var/log/gunicorn.log
  ```

### 2. 服务重启
- **使用虚拟环境重启**：
  ```bash
  # 激活虚拟环境
  source venv/bin/activate
  # 停止服务
  pkill -f gunicorn
  # 启动服务
  gunicorn -w 4 -b 0.0.0.0:5000 app:app --daemon
  ```
- **直接重启**：
  ```bash
  pkill -f gunicorn
  gunicorn -w 4 -b 0.0.0.0:5000 app:app --daemon
  ```

### 3. 数据库备份
- SQLite备份：
  ```bash
  cp /home/mini_program_server/app/mini_program.db /home/backup/
  ```

### 4. 性能监控
- 安装监控工具：
  ```bash
  yum install -y htop
  htop
  ```

## 五、常见问题排查

### 1. 服务无法访问
- **检查防火墙**：
  ```bash
  # 检查FirewallD状态
  systemctl status firewalld
  
  # 启动FirewallD服务
  systemctl start firewalld
  
  # 检查端口是否开放
  firewall-cmd --list-ports
  ```
- **检查服务状态**：`ps aux | grep gunicorn`
- **检查日志**：`tail -f /var/log/gunicorn.log`

### 2. 小程序请求失败
- 检查服务器域名配置
- 检查HTTPS证书是否有效
- 检查API地址是否正确

### 3. 数据库连接失败
- 检查数据库服务状态
- 检查数据库配置
- 检查数据库权限

## 六、成本估算

### 1. 服务器费用
- 腾讯云轻量应用服务器：99元/年（2核2G）
- 阿里云轻量应用服务器：108元/年（2核2G）

### 2. 域名费用
- 普通域名：30-60元/年

### 3. SSL证书
- 免费证书：0元
- 付费证书：100-300元/年

### 4. 总费用
- 最低配置：99（服务器）+ 30（域名）= 129元/年
- 推荐配置：108（服务器）+ 50（域名）+ 0（免费SSL）= 158元/年

## 七、技术支持

- **腾讯云文档**：https://cloud.tencent.com/document/product/1207
- **微信小程序文档**：https://developers.weixin.qq.com/miniprogram/dev/framework/
- **Flask文档**：https://flask.palletsprojects.com/

## 八、代码更新与部署

### 步骤1：本地代码提交到GitHub
1. **初始化Git仓库**（如果尚未初始化）：
   ```bash
   cd mini-programe
   git init
   git add .
   git commit -m "初始化项目"
   ```

2. **关联GitHub仓库**：
   ```bash
   git remote add origin <GitHub仓库地址>
   git push -u origin main
   ```

3. **更新代码后提交**：
   ```bash
   git add .
   git commit -m "更新代码：添加分类重复检查"
   git push origin main
   ```

### 步骤2：服务器拉取最新代码
1. **登录服务器**：
   ```bash
   ssh root@服务器IP
   ```

2. **进入项目目录**：
   ```bash
   cd /home/mini-programe
   ```

3. **拉取最新代码**：
   ```bash
   git pull origin main
   ```

### 步骤3：重启服务使代码生效
1. **重启Gunicorn服务**：
   ```bash
   # 停止服务
   pkill -f gunicorn
   
   # 激活虚拟环境
   source venv/bin/activate
   
   # 重新启动服务
   gunicorn -w 4 -b 0.0.0.0:5000 app:app --daemon
   ```

2. **验证服务是否正常运行**：
   ```bash
   curl http://localhost:5000/api/categories
   ```

### 步骤4：常见问题处理
- **Git拉取冲突**：如果出现冲突，需要手动解决冲突后再提交
- **依赖更新**：如果更新了依赖，需要重新安装：
  ```bash
  source venv/bin/activate
  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
  ```
- **数据库迁移**：如果修改了数据库模型，需要重新初始化数据库

---

本操作手册涵盖了从服务器购买到小程序发布的完整流程，适合初学者和有一定技术基础的开发者使用。根据实际需求，可以适当调整配置和步骤。