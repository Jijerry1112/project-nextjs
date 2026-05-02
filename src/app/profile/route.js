  let profiles = [
    { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
    { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
  ];
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year") || "";
    const name = searchParams.get("name") || "";
    const major = searchParams.get("major") || "";
  // Fetch data - use a local variable to avoid mutating the global array
//   let filteredProfiles = [...profiles];
    let filteredProfiles = await prisma.Students.findMany()

  if (year) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.year.toString() === year
    );
  }
  if (name) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (major) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.major.toLowerCase() === major.toLowerCase()
    );
  }
  return Response.json({ data: filteredProfiles }, { status: 200 });
}
export async function POST(request) {
  const newProfile = await request.json();
  try{
    if(!newProfile.name || newProfile.name.trim() === ""){
      return Response.json({error: "Name is required"}, {status: 400});
    }else if(!newProfile.major || newProfile.major.trim() === ""){
      return Response.json({error: "Major is required"}, {status: 400});
    }else if(!newProfile.year || isNaN(newProfile.year) || (newProfile.year < 1 || newProfile.year > 4)){
      return Response.json({error: "Valid year is required"}, {status: 400});
    }else if(!newProfile.gpa || isNaN(newProfile.gpa) || (newProfile.gpa < 0 || newProfile.gpa > 4)){
      return Response.json({error: "Valid GPA is required"}, {status: 400});
    }
    const newProfileData = {
      name: newProfile.name.trim(),
      major: newProfile.major.trim(),
      year: parseInt(newProfile.year),
      gpa: parseFloat(newProfile.gpa)
    };
    // profiles.push(newProfileData);
    await prisma.Students.create({
        data: newProfileData
    })

    return Response.json(newProfileData, { status: 201 });
  }catch(error){
    return Response.json({error: error.message}, {status: 400});
  }
}
export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  profiles = profiles.filter((profile) => profile.id !== parseInt(id));
  return Response.json({ message: "Profile deleted" }, { status: 200 });
}