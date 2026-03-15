import { prisma } from '@/lib/prisma'
import { PipelineStage, ProductInterest } from '@prisma/client'
import DashboardClient from './_components/DashboardClient'

async function getPipelineData() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [stageCounts,productCounts,countyCounts,totalInquiries,soldCount,recentInquiries,newLast7,bookedLast7,soldLast7,newLast30,soldLast30,attributionRows,recentLeads,appointmentCounts] = await Promise.all([
    prisma.inquiry.groupBy({by:['stage'],_count:{id:true}}),
    prisma.inquiry.groupBy({by:['productInterest'],_count:{id:true}}),
    prisma.inquiry.groupBy({by:['county'],_count:{id:true},where:{county:{not:null}}}),
    prisma.inquiry.count(),
    prisma.inquiry.count({where:{stage:'Sold'}}),
    prisma.inquiry.findMany({take:10,orderBy:{createdAt:'desc'},include:{contact:{select:{firstName:true,lastName:true,email:true,phone:true}}}}),
    prisma.inquiry.count({where:{createdAt:{gte:sevenDaysAgo}}}),
    prisma.inquiry.count({where:{stage:'Booked',updatedAt:{gte:sevenDaysAgo}}}),
    prisma.inquiry.count({where:{stage:'Sold',updatedAt:{gte:sevenDaysAgo}}}),
    prisma.inquiry.count({where:{createdAt:{gte:thirtyDaysAgo}}}),
    prisma.inquiry.count({where:{stage:'Sold',updatedAt:{gte:thirtyDaysAgo}}}),
    prisma.inquiry.groupBy({by:['source','medium','campaign'],_count:{id:true},orderBy:{_count:{id:'desc'}},take:10}),
    prisma.contact.findMany({take:8,orderBy:{createdAt:'desc'},select:{id:true,firstName:true,lastName:true,email:true,phone:true,county:true,createdAt:true,primarySource:true}}),
    prisma.appointment.groupBy({by:['status'],_count:{id:true}}),
  ])
  const allStages=Object.values(PipelineStage) as PipelineStage[]
  const byStageCounts=allStages.reduce((acc,s)=>{acc[s]=stageCounts.find(r=>r.stage===s)?._count.id??0;return acc},{} as Record<string,number>)
  const allProducts=Object.values(ProductInterest) as ProductInterest[]
  const byProductCounts=allProducts.reduce((acc,p)=>{acc[p]=productCounts.find(r=>r.productInterest===p)?._count.id??0;return acc},{} as Record<string,number>)
  const byCountyCounts=countyCounts.reduce((acc,r)=>{if(r.county)acc[r.county]=r._count.id;return acc},{} as Record<string,number>)
  const bookedAppts=appointmentCounts.find(r=>r.status==='Booked')?._count.id??0
  const completedAppts=appointmentCounts.find(r=>r.status==='Completed')?._count.id??0
  return {
    byStageCounts,byProductCounts,byCountyCounts,totalInquiries,
    conversionRate:totalInquiries>0?Math.round((soldCount/totalInquiries)*100):0,
    showRate:bookedAppts+completedAppts>0?Math.round((completedAppts/(bookedAppts+completedAppts))*100):0,
    recentActivity:{newLast7,bookedLast7,soldLast7,newLast30,soldLast30},
    recentInquiries:recentInquiries.map(i=>({id:i.id,stage:i.stage,productInterest:i.productInterest,county:i.county,source:i.source,createdAt:i.createdAt.toISOString(),contact:i.contact})),
    attributionRows:attributionRows.map(r=>({source:r.source??'(direct)',medium:r.medium??'(none)',campaign:r.campaign??'(none)',leads:r._count.id})),
    recentLeads:recentLeads.map(c=>({...c,createdAt:c.createdAt.toISOString()})),
  }
}
export const revalidate=60
export default async function AdminDashboard(){const data=await getPipelineData();return <DashboardClient data={data}/>}
