
import express from "express";
import {
      BusinessPartnership, 
      ExportQuery,
       GeneralInquiry, 
       SupplierRegistration} from "../controller/formsController"
   import {Auth} from "../middleware/auth"    
import { GetformsData } from "../controller/getFormsData";


const router = express.Router()




router.post('/BusinessPartnership',   BusinessPartnership)
router.post('/ExportQuery', ExportQuery)
router.post('/GeneralInquiry',GeneralInquiry)
router.post('/SupplierRegistration', SupplierRegistration)
router.get('/data',Auth, GetformsData)

export default router
