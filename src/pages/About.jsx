import React from 'react'
import HighlightText from "../components/core/HomePage/HighlightText";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from '../components/core/About/Quote';
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from "../components/core/About/Stats"
import LearningGrid from '../components/core/About/LearningGrid';
import ContactFormSection from "../components/core/About/ContactForm"
import Footer from "../components/common/Footer";

const About = () => {
  return (
    <div className='mt-[100px] mx-auto text-white '>
        {/* section 1 */}
        <section className='flex flex-col gap-y-5 '>
            <div className='flex flex-col gap-y-4 text-center '>
                <header className='text-4xl '>
                Driving Innovation in Online Education for a 
                    <HighlightText text={"Brighter Future"}></HighlightText>
                </header>

                <p 
                className='text-md text-richblack-200 '
                >Studynotion is at the forefront of driving innovation in online education. 
                    We're passionate about creating a brighter future by offering cutting-edge courses, 
                    leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </div>

            <div className='flex gap-x-3 mx-auto'>
                <img src={BannerImage1} alt="aboutusImage1" />
                <img src={BannerImage2} alt="aboutusImage2" />
                <img src={BannerImage3} alt="aboutusImage3" />
            </div>
        </section>


        {/* section 2 */}
        <section>
            <div>
                <Quote>

                </Quote>
            </div>
        </section>


        {/* section 3 */}
        <section>
            <div className='flex flex-col'>
                {/* founding story div */}
                <div className='flex '>
                    {/* founding story left box */}
                    <div className='w-[50%]'>
                        <h1>Our Founding Story </h1>
                        <p>
                        Our e-learning platform was born out of a shared vision and passion for transforming education. 
                        It all began with a group of educators, technologists, and lifelong learners who recognized the 
                        need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                        </p>

                        <p>
                        As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. 
                        We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. 
                        We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                        </p>
                    </div>

                    {/* founding story right box */}
                    <div className='w-[50%]'>
                        <img src={FoundingStory} alt="foundingStory" />
                    </div>
                </div>


                {/* vision and mission div */}
                <div className='flex'> 
                    {/* left box */}
                    <div>
                        <h1>
                        Our Vision
                        </h1>
                        <p>
                        With this vision in mind, we set out on a journey to create an e-learning platform 
                        that would revolutionize the way people learn. Our team of dedicated experts worked 
                        tirelessly to develop a robust and intuitive platform that combines cutting-edge technology 
                        with engaging content, fostering a dynamic and interactive learning experience.
                        </p>
                    </div>

                    {/* right box */}
                    <div>
                        <h1>
                        Our Mission
                        </h1>
                        <p>
                        our mission goes beyond just delivering courses online. We wanted to create a 
                        vibrant community of learners, where individuals can connect, collaborate, and learn 
                        from one another. We believe that knowledge thrives in an environment of sharing and dialogue, 
                        and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* section 4 */}
        <StatsComponent></StatsComponent>

        {/* section 5 */}
        <section className='mx-auto flex flex-col items-center justify-between gap-5 mb-[140px]'>
            <LearningGrid></LearningGrid>
            <ContactFormSection></ContactFormSection>
        </section>

        {/* section 6 */}
        <section>
            <div>
                Reviews from other learners
                {/* Review Slider */}
            </div>
        </section>

        {/* Footer */}
        <Footer></Footer>

    </div>
  )
}

export default About