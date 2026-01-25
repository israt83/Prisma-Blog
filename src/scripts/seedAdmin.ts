
import { prisma } from "../lib/prisma"
import { Role } from "../middleware/auth"

async function seedAdmin() {
    try {
        const adminData ={
            name: "Admin1 Blog",
            email : "admin1@gmail.com",
            role : Role.ADMIN,
            password : "admin123"
        }
        // check user exist on db or not 
        const existingUser = await prisma.user.findUnique({
            where : {
                email : adminData.email
            }
        })

        if(existingUser){
            throw new Error("Admin user already exists")
        }

        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email',{
            method : 'POST',
            headers :{
                'Content-Type' : 'application/json',
                origin : 'http://localhost:4000'
            },
            body : JSON.stringify(adminData)
        })
        console.log("Admin created successfully")
        if(signUpAdmin.ok){
            await prisma.user.update({
                where : {
                    email : adminData.email
                },
                data :{
                    emailVerified : true
                }
            })
            console.log('Email verification status updated')
        }



    } catch (error) {
        console.log(error)
    }
}

seedAdmin();
