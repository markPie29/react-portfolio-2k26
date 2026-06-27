import ScrollFloat from "../../components/ScrollFloat";



const ProjectsSection = () => {
    return (
        <section id="projects" className="relative z-10 py-24 px-6 md:px-12 lg:px-24">
            {/* Start adding your projects elements here */}
            <ScrollFloat
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=50%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.03}
                textClassName="text-center font-threat font-2xl"
            >
                Projects
            </ScrollFloat>

        </section>
    )
}

export default ProjectsSection
