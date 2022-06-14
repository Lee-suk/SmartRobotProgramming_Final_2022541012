//https://sequelize.org/docs/v6/core-concepts/model-basics/
// Model Definition

var { Sequelize } = require("sequelize")

// 사용자
global.User = sequelize.define('User', {
    // 아이디
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    // 이름
    name: {
        type: Sequelize.STRING
    },
    // 패스워드
    password: {
        type: Sequelize.STRING
    }
});

// 게시판 
global.Board = sequelize.define('Board', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    //제목
    title: Sequelize.STRING,
    //내용
    body: Sequelize.TEXT,
    //작성시간
    writeTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    //조회수
    viewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

// 게시판 작성
Board.belongsTo(User, {
    foreignKey: "userId",
    as: "writeUser"
})

// Model synchronization
sequelize.sync({
    // 강제 업데이트 / 기존 db 데이터 없어짐
    // force: true
    // 업데이트 / 기존 db 데이터 그대로
    alter: true
})