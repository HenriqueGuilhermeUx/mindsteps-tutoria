import {Router} from 'express'
import {authMiddleware} from './auth.js'
import {acceptSchoolInvite,bulkCreateInvites,configureSchool,createClass,createSchoolInvite,getSchoolSetup,listAudit,listClasses,listGuardians,listSchoolInvites} from '../services/schoolCommercial.js'
import {getCommercialReadiness} from '../services/schoolReadiness.js'
import {getRoster,moveStudent,setStudentEnrollment} from '../services/schoolRoster.js'
import {changeStaffRole,listStaff,setStaffStatus} from '../services/schoolStaff.js'
import {getGuardianStudents} from '../services/guardianPortal.js'
import {assignTeacher,getTeacherRoster,listTeachingScope,setTeacherAssignmentStatus} from '../services/schoolTeachingScope.js'
const router=Router()
router.use(authMiddleware)
const fail=(res:any,error:unknown,status=400)=>res.status(status).json({message:error instanceof Error?error.message:'Não foi possível concluir a operação'})

router.post('/invites/accept',async(req,res)=>{try{res.json(await acceptSchoolInvite(req.userId,String(req.body?.token||'')))}catch(e){fail(res,e)}})
router.get('/guardian/me/students',async(req,res)=>{try{res.json(await getGuardianStudents(req.userId))}catch(e){fail(res,e,403)}})
router.get('/:institutionId/setup',async(req,res)=>{try{res.json(await getSchoolSetup(req.userId,req.params.institutionId))}catch(e){fail(res,e,403)}})
router.put('/:institutionId/setup',async(req,res)=>{try{res.json({institution:await configureSchool(req.userId,req.params.institutionId,req.body||{})})}catch(e){fail(res,e)}})
router.get('/:institutionId/readiness',async(req,res)=>{try{res.json(await getCommercialReadiness(req.userId,req.params.institutionId))}catch(e){fail(res,e,403)}})
router.get('/:institutionId/classes',async(req,res)=>{try{res.json({classes:await listClasses(req.userId,req.params.institutionId)})}catch(e){fail(res,e,403)}})
router.post('/:institutionId/classes',async(req,res)=>{try{res.json({class:await createClass(req.userId,req.params.institutionId,req.body||{})})}catch(e){fail(res,e)}})
router.get('/:institutionId/students',async(req,res)=>{try{res.json(await getRoster(req.userId,req.params.institutionId,String(req.query.status||'active')))}catch(e){fail(res,e,403)}})
router.put('/:institutionId/students/:studentUserId/class',async(req,res)=>{try{res.json({student:await moveStudent(req.userId,req.params.institutionId,req.params.studentUserId,req.body?.classId||null)})}catch(e){fail(res,e)}})
router.put('/:institutionId/students/:studentUserId/enrollment',async(req,res)=>{try{const status=req.body?.status;if(status!=='active'&&status!=='inactive')return fail(res,new Error('Status inválido'));res.json({student:await setStudentEnrollment(req.userId,req.params.institutionId,req.params.studentUserId,status)})}catch(e){fail(res,e)}})
router.get('/:institutionId/staff',async(req,res)=>{try{res.json(await listStaff(req.userId,req.params.institutionId,typeof req.query.status==='string'?req.query.status:undefined))}catch(e){fail(res,e,403)}})
router.put('/:institutionId/staff/:staffUserId/role',async(req,res)=>{try{res.json({member:await changeStaffRole(req.userId,req.params.institutionId,req.params.staffUserId,req.body?.role)})}catch(e){fail(res,e)}})
router.put('/:institutionId/staff/:staffUserId/status',async(req,res)=>{try{const status=req.body?.status;if(status!=='active'&&status!=='inactive')return fail(res,new Error('Status inválido'));res.json({member:await setStaffStatus(req.userId,req.params.institutionId,req.params.staffUserId,status)})}catch(e){fail(res,e)}})
router.get('/:institutionId/teaching-scope',async(req,res)=>{try{res.json(await listTeachingScope(req.userId,req.params.institutionId))}catch(e){fail(res,e,403)}})
router.post('/:institutionId/teaching-scope',async(req,res)=>{try{res.json({assignment:await assignTeacher(req.userId,req.params.institutionId,req.body)})}catch(e){fail(res,e)}})
router.put('/:institutionId/teaching-scope/:assignmentId/status',async(req,res)=>{try{const status=req.body?.status;if(status!=='active'&&status!=='inactive')return fail(res,new Error('Status inválido'));res.json({assignment:await setTeacherAssignmentStatus(req.userId,req.params.institutionId,req.params.assignmentId,status)})}catch(e){fail(res,e)}})
router.get('/:institutionId/classes/:classId/roster',async(req,res)=>{try{res.json(await getTeacherRoster(req.userId,req.params.institutionId,req.params.classId))}catch(e){fail(res,e,403)}})
router.get('/:institutionId/invites',async(req,res)=>{try{res.json({invites:await listSchoolInvites(req.userId,req.params.institutionId)})}catch(e){fail(res,e,403)}})
router.post('/:institutionId/invites',async(req,res)=>{try{res.json({invite:await createSchoolInvite(req.userId,req.params.institutionId,req.body)})}catch(e){fail(res,e)}})
router.post('/:institutionId/import',async(req,res)=>{try{res.json(await bulkCreateInvites(req.userId,req.params.institutionId,req.body?.rows))}catch(e){fail(res,e)}})
router.get('/:institutionId/guardians',async(req,res)=>{try{res.json({guardians:await listGuardians(req.userId,req.params.institutionId)})}catch(e){fail(res,e,403)}})
router.get('/:institutionId/audit',async(req,res)=>{try{res.json({events:await listAudit(req.userId,req.params.institutionId,Number(req.query.limit)||100)})}catch(e){fail(res,e,403)}})
export default router
