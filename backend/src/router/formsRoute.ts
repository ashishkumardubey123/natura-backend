
import express from "express";
import {
      BusinessPartnership, 
      ExportQuery,
       GeneralInquiry, 
       SupplierRegistration} from "../controller/formsController"
   import {Auth} from "../middleware/auth"    
   import { GetformsData, UpdateFormStatus } from '../controller/getFormsData'; // Apne actual path se replace karein


const router = express.Router()




router.post('/BusinessPartnership',   BusinessPartnership)
router.post('/ExportQuery', ExportQuery)
router.post('/GeneralInquiry',GeneralInquiry)
router.post('/SupplierRegistration', SupplierRegistration)
router.get('/data',Auth, GetformsData)
router.patch('/update-status/:id', Auth, UpdateFormStatus);


export default router
