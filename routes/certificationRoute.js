/* eslint-disable */
const express = require("express");
const { r } = require('../ConstantStore');
const bodyParser = require("body-parser");
const certificationRoute = express.Router();

certificationRoute.use(bodyParser.json())

certificationRoute.post("/:id" , async (req,res) => {
    let bID = req.params.id;
    if(req.body.sk !== "daddynoobonaacz") return res.json({success: false,"message": "no u"});

    try {
        r.table('users').filter({"id": bID}).update({ badges: [Founder] });
        res.json({sucess: true, message: "Updated Succesfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

module.exports = certificationRoute;