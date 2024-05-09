const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async(req, res)=> {
    try {
        //data fetch
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create section
        const newSection = await  Section.create({sectionName});

        //update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true}
        )
        //HM : use populate in such a way that replace sections and 
        //subsections both in the updatedCoursesDetails

        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while creating section",
        })
    }
}

//update section
exports.updateSection = async(req, res)=>{
    try {
        //data input
        const {sectionName, sectionId} = req.body;

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing the properties",
            })
        }
        //data update
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new: true}
        )
        //return response
        return res.status(200).json({
            success: false,
            message: "Section updated successfully",
            updatedSection
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while updating section"
        })
    }
}


//delete section
exports.deleteSection = async(req, res) => {
    try {
      //get id => assuming that we are sending id in params
      //HM req.params ke sath test karana
      const {sectionId, courseId} = req.body;
      //use findbyidanddelete
      await Section.findByIdAndDelete(sectionId);
      //return res  
      //TODO: do we need to delete the id from course schema??
      await Course.findByIdAndUpdate(
          courseId,
          {
              $pull: {
                  courseContent: sectionId,
              }
          },
          {new: true}
      )
      return res.status(200).json({
        success: true,
        message: "Section is deleted successfully"
      })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while deleting section, Please try again", 
        })
    }
}