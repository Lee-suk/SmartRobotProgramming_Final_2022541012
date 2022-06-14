var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 회원가입
router.post("/join", async function (req, res) {
  var body = req.body
  console.log(body)

  // 회원가입 중복 체크
  var alreadyUser = await User.findOne({
    where: {
      id: body.id
    }
  })

  if (alreadyUser != null) {
    res.json({
      result: "fail",
      message: "이미 존재하는 아이디입니다."
    })
    return  // 밑에 있는 코드 실행 x
  }

  console.log(alreadyUser)

  /* 
  회원가입 create 방법 1

  User.create(body).then(result => {
    res.json({
      result: "ok"
    })
  })
  
  */

  // 회원가입 create 방법 2 : async await 문법
  // await은 async 함수 안에서만 사용가능함
  var result = await User.create(body)
  res.json({
    result: "ok"
  })

})

// 로그인
router.post("/login", async function (req, res) {
  console.log(req.body)

  // 로그인 데이터 일치여부 체크
  var user = await User.findOne({
    attributes: ["id", "name"],
    where: {
      id: req.body.id,
      password: req.body.password
    }
  })

  if (user == null) {
    res.json({
      result: "fail",
      message: "아이디 또는 비밀번호가 잘못되었습니다."
    })
    return
  }

  // 사용자 세션 
  req.session.user = user

  res.json({
    result: "ok",
    user: user
  })

})

// 로그인 사용자 정보
router.post('/info', async (req, res) => {
  //로그인 되어있을 때
  if (req.session.user) {
    res.json({
      result: "ok",
      user: req.session.user
    })
  }
  else {
    res.json({
      result: "fail"
    })
  }
})

// 로그아웃
router.post('/logout', async (req, res) => {
  //로그아웃 했을때
  req.session.destroy()
  res.json({
    result: "ok"
  })
})

module.exports = router;
