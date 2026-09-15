import { supabase } from '../db/index.js'

async function assertMember(userId:string,institutionId:string){
  const {data,error}=await supabase.from('mindsteps_institution_members').select('role,status').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle()
  if(error||!data) throw new Error('Você não tem acesso a esta instituição')
  return data
}

export async function getCommercialReadiness(userId:string,institutionId:string){
  await assertMember(userId,institutionId)
  const [institutionResult,licenseResult,classesResult,studentsResult,staffResult,teachersResult,invitesResult]=await Promise.all([
    supabase.from('mindsteps_institutions').select('id,name,legal_name,document,logo_url,onboarding_status,plan_code,seat_limit').eq('id',institutionId).single(),
    supabase.from('mindsteps_school_licenses').select('*').eq('institution_id',institutionId).maybeSingle(),
    supabase.from('mindsteps_school_classes').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('status','active'),
    supabase.from('mindsteps_student_links').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('status','active'),
    supabase.from('mindsteps_institution_members').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('status','active'),
    supabase.from('mindsteps_institution_members').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('status','active').eq('role','teacher'),
    supabase.from('mindsteps_school_invites').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('status','pending')
  ])
  const institution=institutionResult.data
  if(!institution) throw new Error('Instituição não encontrada')
  const license=licenseResult.data
  const activeStudents=Number(studentsResult.count||0)
  const seatLimit=Number(license?.seat_limit||institution.seat_limit||100)
  const checks=[
    {key:'profile',label:'Perfil institucional',ok:Boolean(institution.name&&institution.legal_name)},
    {key:'license',label:'Licença configurada',ok:Boolean(license)},
    {key:'classes',label:'Ao menos uma turma',ok:Number(classesResult.count||0)>0},
    {key:'staff',label:'Equipe adicionada',ok:Number(staffResult.count||0)>1},
    {key:'teacher',label:'Professor adicionado',ok:Number(teachersResult.count||0)>0},
    {key:'students',label:'Alunos vinculados',ok:activeStudents>0}
  ]
  const completed=checks.filter(item=>item.ok).length
  return {
    ready:completed===checks.length,
    score:Math.round(completed/checks.length*100),
    checks,
    institution,
    license,
    usage:{activeStudents,seatLimit,seatsAvailable:Math.max(0,seatLimit-activeStudents),classes:Number(classesResult.count||0),staff:Number(staffResult.count||0),teachers:Number(teachersResult.count||0),pendingInvites:Number(invitesResult.count||0)}
  }
}
