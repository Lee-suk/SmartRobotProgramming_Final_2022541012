var express = require('express');
var router = express.Router();

// 글 작성
router.post('/write', async function (req, res) {
    // 사용자 세션
    if (req.session.user) {
        req.body.userId = req.session.user.id
    }

    // 게시판 글 추가
    await Board.create(req.body)
    res.json({
        result: "ok"
    })
})

// 글 목록
router.post("/list", async function (req, res) {
    // 페이지 : offset
    var page = req.body.page

    if (!page) {
        page = 1
    }

    var itemPerPage = 5 // page당 보여지는 게시물 개수

    var offset = (page - 1) * itemPerPage

    // DB에서 가져오기
    // order by writeTime desc
    // limit 5
    var boardList = await Board.findAll({
        // 글 작성자 : 로그인 사용자
        include: {
            model: User,
            as: "writeUser"
        },
        limit: itemPerPage,
        offset: offset,
        order: [["writeTime", "DESC"]] //정렬할 필드 값, 정렬할 방향
    })

    // 페이지 총 개수
    var count = await Board.count() //select count(*) from Boards
    var pageCount = Math.ceil(count / itemPerPage) // 반올림 Math.ceil()

    res.json({
        boardList: boardList,
        pageCount: pageCount
    })
})

// 게시판 아이템
router.post('/item', async function (req, res) {
    var id = req.body.id
    var board = await Board.findOne({
        where: {
            id: id
        },
        include: {
            model: User,
            as: "writeUser",
            attributes: ["id", "name"]
        }
    })
    res.json({
        board: board
    })
})

// 삭제
router.post("/remove", async (req, res) => {
    var id = req.body.id

    if (!req.session.user) {
        return res.json({
            result: "fail",
            msg: "로그인이 필요합니다."
        })
    }

    var board = await Board.findOne({
        where: {
            id: id
        },
    })
    // 로그인된 사용자와 삭제하려는 게시물의 작성자가 같은지 확인
    if (board.userId == req.session.user.id) {
        await Board.destroy({
            where: {
                id: id
            }
        })
        res.json({
            result: "ok"
        })
    }
    // 삭제하려는 게시물과 로그인 사용자가 같지 않음
    else {
        res.json({
            result: "fail",
            msg: "삭제할 권한이 없습니다. "
        })
    }
    console.log(board)
})

// 수정
router.post("/modify", async (req, res) => {
    var id = req.body.id

    if (!req.session.user) {
        return res.json({
            result: "fail",
            msg: "로그인이 필요합니다."
        })
    }

    var board = await Board.findOne({
        where: {
            id: id
        },
    })
    // 로그인된 사용자와 수정하려는 게시물의 작성자가 같은지 확인
    if (board.userId == req.session.user.id) {
        await Board.update({
            title: req.body.title,
            body: req.body.body
        }, {
            where: {
                id: id
            }
        })
        res.json({
            result: "ok"
        })
    }
    // 수정하려는 게시물과 로그인 사용자가 같지 않음
    else {
        res.json({
            result: "fail",
            msg: "수정할 권한이 없습니다. "
        })
    }

})

module.exports = router;