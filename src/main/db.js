var SQLite3 = require('sqlite3').verbose()
/**
 * 使用sqlite3
 * 需求: 把数组中的每一个对象，每一个对象的属性，存到xxx.db中，像数据库一样操作他们
 * 功能  1. 创建数据库(存在则打开)
 *      2. 创建一个表（存在则不用创建）
 *      3. 有了数据库与表，基本的功能如下 
 *        1.插入数据 （单个数据，多行数据并行插入）
 *        2.更新数据（根据不同的条件更新每列数据）
 *        3.删除数据 (根据不同的条件删除每列数据）
 *        4.查询数据 （单个数据查询，多个数据查询）
 */
export default class HandleDB {
  constructor(options) {
    // 数据库文件 （文件路径 + 文件名称）
    this.databaseFile = options && options.databaseFile || `./data/test.db`
    // 表名
    // this.tableName = options && options.tableName || 'absTable'
    // 打开的数据库对象
    this.db = null
  }

  // 连接数据库（不存在就创建，存在则打开）
  connectDataBase() {
    let that = this
    return new Promise((resolve, reject) => {
      that.db = new SQLite3.Database(that.databaseFile, function (err) {
        // console.log('数据库连接结果', err)
        if (err) reject(new Error(err))
        console.log(that.databaseFile + ', 数据库连接成功')
        resolve('数据库连接成功')
      })
    })
  }
  /**
   * 创建表
   * @param sentence    CREATE TABLE 语句
   * @used
    let sentence = `
      create table if not exists ${this.tableName}(
          begin_time varchar(255),
          create_time varchar(255),
          end_time varchar(255),
          play_id varchar(255),
          postion_id int(50),
          status int(50),
          task_id int(50)
      );`
    this.createTable(sentence);
    */
  createTable(sentence) {
    let that = this
    return new Promise((resolve, reject) => {
      that.connectDataBase().then(res => {
        that.db.exec(sentence, function (err) {
          if (err) reject(new Error(err))
          console.log('表创建成功/已经存在，不需要创建')
          resolve(`表创建成功/已经存在，不需要创建`)
        })
      }).catch(err => {
        reject(new Error(err))
      })
    })
  }

  /**
  * 执行 增  删  改  查(单个数据查询或者多个数据查询)
  * @param sql    sql语句
  * @param param     参数(可以是数组或者数字或者字符串,根据sql语句来定)
  * @param mode    执行模式, 默认run,执行sql,如果查询的话,则使用get(单个)all(多个)
  * @returns {Promise}
    @used
    增 : this.sql(`insert into ${this.tableName} (begin_time, create_time, end_time, play_id, postion_id, status, task_id) values(?, ?, ?, ?, ?, ?, ?)`,
                 [obj.begin_time, obj.create_time, obj.end_time, obj.play_id, obj.postion_id, obj.status, obj.task_id]);

    删 : this.sql(`delete from ${this.tableName} where id = ?`, id);

    改 : this.sql(`update ${this.tableName} set begin_time = ?, status = ? where postion_id = ?`, [begin_timeValue, statusValue, postion_idValue]);

    查 : this.sql(`select * from ${this.tableName} where id = ?`, id, 'get/all');
  */
  sql(sql, param, mode) {
    let that = this
    mode = mode == 'all' ? 'all' : mode == 'get' ? 'get' : 'run'
    return new Promise((resolve, reject) => {
      that.db[mode](sql, param,
        function (err, data) {    // data: Array, Object
          if (err) {
            reject(new Error(err));
          } else {
            // console.log('-------', this, data)
            if (data) {
              console.log(`${mode} 语句执行成功，存在数据`)
              resolve(data);   // 返回数据查询成功的结果 {...data}
            } else {
              if (mode === 'get') {
                 console.log(`get 语句执行成功 但无数据`)
                resolve({})
              } else {
                console.log(`表示 ${mode} sql语句的成功`)
                resolve({
                  msg: 'success',
                  id: this.lastID
                }) // 提示 增 删 改 操作成功
              }
            };
          };
        }
      );
    });
  }

  /**
   * 删除表里所以数据
   * @param {String} tableName 标名称 
   */

  delectTableData(tableName) {
    let that = this
    return new Promise((resolve, reject) => {
      that.sql(`delete from ${tableName}`).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(new Error(err))
      })
    })
  }
}