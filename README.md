
## 簡介
twsr測試用圖台

## 使用
git clone    
執行 npm install    
執行 bower install    
修改 config中的db連線資訊(if needed)   

更新DB schema
npm install sequelize-auto
npm install mysql
sequelize-auto -o "./models" -d g0v -h 192.168.2.104 -u g0v -p 3306 -x g0v1111 -e mysql

## host site
http://gmap.twsr.xyz