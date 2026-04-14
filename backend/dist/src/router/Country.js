"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { getAllCountries } = require("../controller/CountryDataController");
const countryRouter = express.Router();
countryRouter.get('/AllCountries', getAllCountries);
module.exports = countryRouter;
