const express = require('express');
const mongojs = require("mongojs");
const router = express.Router();
const fs = require('fs');
const { json } = require('body-parser');
const getId = () => new Promise((resolve, reject) => {
	const jsonData = fs.readFileSync('posts.json')
	var data = JSON.parse(jsonData)
	var index = data.data.length - 1;
	let newId = parseInt(data.data[index].id) + 1;
	return resolve(newId);
})

const getIndex = (id, data) => {
	let index;
	for (let i = 0; i < data.length; i++) {
		if (data[i].id == id) {
			index = i;
		}
	}
	return index;
}

//READ POSTS
router.get("/getpost", async (req, res) => {
	const jsonData = fs.readFileSync('posts.json')
	var data = JSON.parse(jsonData)
	res.json(data)
});

router.get("/getpost/:id", async (req, res) => {
	const jsonData = fs.readFileSync('posts.json')
	var data = JSON.parse(jsonData)
	let index = getIndex(req.params.id, data.data);
	res.json(data.data[index])
});

router.get("/delete/:id", async (req, res) => {
	const jsonData = fs.readFileSync('posts.json')
	let data = JSON.parse(jsonData)
	let index = await getIndex(req.params.id, data.data);
	data.data.splice(index, 1);
	var json = JSON.stringify(data); //convert it back to json
	fs.writeFile('posts.json', json, 'utf8', function (err, reply) {
		res.send(true);
	});
});


router.post("/insertpost", async (req, res) => {
	let id = await getId();
	fs.readFile('posts.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			res.send(err);
		} else {
			let temp = {
				id: id,
				judul: req.body.judul,
				isi: req.body.isi,
				gambar: req.body.gambar
			}
			obj = JSON.parse(data); //now it an object
			obj.data.push(temp); //add some data
			let json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('posts.json', json, 'utf8', function (err, reply) {
				res.send(true);
			}); // write it back 
		}
	});
});


router.post("/editpost", async (req, res) => {
	fs.readFile('posts.json', 'utf8', async function readFileCallback(err, data) {
		if (err) {
			res.send(err);
		} else {
			let temp = {
				id: req.body.id,
				judul: req.body.judul,
				isi: req.body.isi,
				gambar: req.body.gambar
			}
			obj = JSON.parse(data); //now it an object
			let index = await getIndex(req.body.id, obj.data);
			obj.data[index] = temp; //add some data
			var json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('posts.json', json, 'utf8', function (err, reply) {
				res.send(true);
			}); // write it back 
		}
	});
});

router.post("/login", async (req, res) => {
	fs.readFile('posts.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			res.send(err);
		} else {
			data = JSON.parse(data); //now it an object
			let username = req.body.username;
			let password = req.body.password;
			if (username == data.user.username && password == data.user.password) {
				res.send(true);
			} else {
				res.send(false);
			}
		}
	});
});
module.exports = router;