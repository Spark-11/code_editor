const userModel = require("../models/userModel")
const projectModel = require("../models/projectModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
exports.signUp =async (req,res) => {
    try{
        let {email,password,fullName} = req.body
        let emailCondition = await userModel.findOne({email})
        if(emailCondition){
            return res.status(400).json({
                success: false,
                msg: "Something went wrong !"
            })
        }
        bcrypt.hash(password, 12,async function(err, hash) {
            
            let user = await userModel.create({
                fullName,
                email,
                password: hash   
            })
            res.status(200).json({
                success: true,
                msg: "User created successfully"
                
            })
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

exports.login = async (req,res) => {
    try{
        let {email,password} = req.body
        let user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "Something went wrong !"
            })
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                let token = jwt.sign({id: user._id},'secretKey')
                return res.status(200).json({
                    success: true,
                    msg: "User logged in successfully !",
                    token
                })
            } else{
                return res.status(400).json({
                    success: false,
                    msg: "password is wrong !"
                })
            }
        });
    } catch(error){
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }

}

function getStartupCode(language) {
    if(language.toLowerCase() === 'python'){
        return `print("Hello world")`
    } else if(language.toLowerCase() === 'java'){
        return `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}`
    } else if(language.toLowerCase() === 'cpp'){
        return `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}`
    } else if(language.toLowerCase() === 'c'){
        return `#include <stdio.h>\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}`
    } else if(language.toLowerCase() === 'javascript'){
        return `console.log("Hello World!");`
    } else if(language.toLowerCase() === 'go'){
        return `package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello World!")\n}`
    } else if(language.toLowerCase() === 'bash'){
        return `echo "Hello world"`
    } else {
        return 'Language not supported.'
    }
}
exports.createProject = async (req,res) => {
    try{
        
        let {name,projectLanguage,createdBy,token,version} = req.body
        let decoded = jwt.verify(token,'secretKey')
        let user = await userModel.findOne({_id: decoded.id})
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User not found !"
            })
        }
        let project = await projectModel.create({
            name,
            projectLanguage : projectLanguage,
            createdBy: user._id,
            code: getStartupCode(projectLanguage),
            version:version
        })
        return res.status(200).json({
            success: true,
            msg: "Project created successfully !",
            projectId: project._id
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

exports.savedProject = async (req,res) => {
    try{
        let {token, projectId, code} = req.body
        let decoded = jwt.verify(token,'secretKey')
        let user = await userModel.findOne({_id: decoded.id})

        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User not found !"
            })
        }
        let project = await projectModel.findOne({_id: projectId})
        if(!project){
            return res.status(400).json({
                success: false,
                msg: "Project not found !"
            })
        }
        project.code = code
        await project.save()
        return res.status(200).json({
            success: true,
            msg: "Project saved successfully !"
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

exports.getProjects = async (req,res) => {
    try{
        let {token} = req.body
        let decoded = jwt.verify(token,'secretKey')
        let user = await userModel.findOne({_id: decoded.id})
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User not found !"
            })
        }
        let projects = await projectModel.find({createdBy: user._id})
        return res.status(200).json({
            success: true,
            msg: "Projects fetched successfully !",
            projects
        })
    } catch(error){
        return res.status(500).json({
            success: false,            
            msg: error.message
        })
    }
}

exports.getProject = async (req,res) => {
    try{
        let {token, projectId} = req.body
        let decoded = jwt.verify(token,'secretKey')
        let user = await userModel.findOne({_id: decoded.id})
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User not found !"
            })
        }
        let project = await projectModel.findOne({_id: projectId})
        if(!project){
            return res.status(400).json({
                success: false,
                msg: "Project not found !"
            })
        }
        return res.status(200).json({
            success: true,
            msg: "Project fetched successfully !",
            project
        })
    } catch(error){
        return res.status(500).json({
            success: false,            
            msg: error.message
        })
    }
}

exports.deleteProject = async (req,res) => {
    try{
        let {token, projectId} = req.body
        let decoded = jwt.verify(token,'secretKey')
        let user = await userModel.findOne({_id: decoded.id})
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User not found !"
            })
        }
        let project = await projectModel.findOneAndDelete({_id: projectId})
            return res.status(200).json({
                success: true,
                msg: "Project deleted successfully !"
            })
    } catch(error){
        return res.status(500).json({
            success: false,            
            msg: error.message
        })
    }
}

exports.editProject = async (req,res) => {
    try{
        let {token, projectId, name} = req.body
        let decoded = jwt.verify(token,'secretKey')
        let user = await userModel.findOne({_id: decoded.id})
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found !"
            })
        }
        let project = await projectModel.findOne({_id: projectId})
        if(project){
            project.name = name
            await project.save()
            return res.status(200).json({
                success: true,
                msg: "Project edited successfully !"
            })
        }else{
            return res.status(404).json({
                success: false,
                msg: "Project not found !"
            })
        }
    } catch(error){
        return res.status(500).json({
            success: false,            
            msg: error.message
        })
    }
}