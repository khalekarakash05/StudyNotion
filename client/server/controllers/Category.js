const Category = require("../models/Category");


//create Category
exports.createCategories = async(req, res) =>{
    try {
        const {name, description} = req.body;

        if(!name && !description){
            return res.status(400).json({
                success: false,
                message: "All the fields are required",
            })
        }

        const CategorysData = await Category.create({
            name: name,
            description: description,
        });

        console.log("Categorys info: ",CategorysData);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


//get all Category=> showAllCategorys

exports.showAllCategories = async(req, res) => {
    try {
        const allCategories = await Category.find({}, {name: true, description: true});

        return res.status(200).json({
            success: true,
            data: allCategories,
            message: "All Categorys are returned successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//category details page
// exports.categoryPageDetails = async(req, res) => {
//     try {
//         const {categoryId} = req.body;

//         const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

//         console.log("selected category", selectedCategory);

//         if(!selectedCategory){
//             res.status(404).json({
//                 success: false,
//                 message: "Category not found",
//             })
//         }

//         if(selectedCategory.courses.length === 0){
//             console.log("No courses found for the selected category");
//             res.status(404).json({
//                 success: false,
//                 message: "No courses found for the selected category",
//             })
//         }

//         const selectedCourse = selectedCategory.courses;

//         //get courses for other categories
//         const categoriesExceptSelected = await Category.findById({
//             id: {$ne: categoryId}
//         }).populate("courses");

//         let differentCourses = []
//         for(const category of categoriesExceptSelected){
//             differentCourses.push(...category.courses);
//         }

//         //get top selling courses across all categories
//         const allCategoriesCourses = await Category.find().populate("courses");
//         const allCourses = allCategoriesCourses.flatMap((category) => {
//             category.course;
//         })
//         const mostSellingCouses = allCourses
//                                 .sort((a, b)=> b.sold - a.sold)
//                                 .slice(0, 10);

//         return res.status(200).json({
//             success:true,
//             selectedCourse: selectedCourse,
//             differentCourses: differentCourses,
//             mostSellingCouses: mostSellingCouses,
//             message: "All category details are fetched successfully",
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error occured while fetching category details",
//         })
//     }
// }




exports.categoryPageDetails = async(req, res) => {
    try {
        //ger category id
        const {categoryId} = req.body;
        //get courses for that category id
        const selectedCategory = await Category.findById(categoryId)
                                        .populate("course").exec();
        //validation
        if(!selectedCategory){
            return res.status(404).jons({
                success: false,
                message: "Data not found",
            })
        }
        //get courses for different categories
        const differentCourses = await Category.find({
                    _id: {
                        $ne: categoryId
                    }
        }).populate("course").exec();
        //get top 10 selling courses
        //HM :  T
        //return res
        return res.status(200).json({
            success: true,
            message: "Category details are fetched successfully",
            data: {
                selectedCategory,
                differentCourses,

            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}