import React from "react"
import ReactDOM from "react-dom"
import {List, ListItem, LinkListItem, ContentHandler, Article, Image, BackgroundImage, useResponse} from "./base"

function App(props) {
    const [response, isLoaded, error] = useResponse("./static/main.json")
    return (
        <ContentHandler contentState={[isLoaded, error]}>
            <div className="content_container">
                <Intro content={response.intro}/>
                <Projects content={response.projects}/>
                <Footer content={response.footer}/>
            </div>
        </ContentHandler>
    )
}

function Intro(props) {
    return (
        <Section className="intro">
            <article>
                <Article {...props.content}/>
            </article>
        </Section>
    )
}   

function Projects(props) {
    const content = props.content || {}
    const relatedContent = content.relatedContent || []
    return (
        <Section title={content.title} className="projects">
            <article>
                <Slider content={relatedContent}/>
            </article>
        </Section>
    )
}

function Slider(props) {
    const firstSlide   = props.content[0]
    const showDuration = 4000, hideAnimationDur = 2000
    const style  = {"animationDuration": `${hideAnimationDur}ms`}
    const initial = <BackgroundImage id={firstSlide.id} name={firstSlide.imageName} key={firstSlide.id} style={style}/>
    const [images, setImages] = React.useState(initial)
    React.useEffect(() => {
        if (!Array.isArray(images)) setTimeout(showNext, showDuration)
    }, [images])
    function showNext() {
        const project = images.props
        const next = getValidProject(props.content, project.id)
        const nextImage = <BackgroundImage id={next.id} name={next.imageName} key={next.id} style={style}/>
        setImages(
            [
                <BackgroundImage className="hide" name={project.name} key={project.id} style={style}/>,
                nextImage
            ]
        )
        setTimeout(() => setImages(nextImage), hideAnimationDur)
    }
    return (
        <div>
            {images}
        </div>
    )    
}

function getValidProject(related_content, lastShowedProject) {
    const lastPIndex = related_content.length - 1
    let indexOfCurr = -1
    if (typeof lastShowedProject == "object")
        indexOfCurr = related_content.indexOf(lastShowedProject)
    else if (typeof +lastShowedProject == "number")
        indexOfCurr = related_content.findIndex(val => {
            return val.id == lastShowedProject
        })
    return indexOfCurr == lastPIndex ? related_content[0] : related_content[indexOfCurr + 1]
}

function Footer(props) {
    const content = props.content || {}
    return (
        <footer className="footer section" id="footer">
            {content.title}
        </footer>
    )
}

function RawLink(props) {
    const {children, ...rest} = props
    return <a {...rest}>{children}</a>
}

function Section(props) {
    const {className, title, children, _ref, ...rest} = props
    const header = title && <h1>{props.title}</h1>
    const sectionRef = React.useCallback((section) => {
        if (section !== null) {
            if (window.location.hash == "#" + className) section.scrollIntoView()
            if (typeof _ref == "function") _ref(section)
        }
    }, [])
    return (
        <section className={className + " section"} id={className} ref={sectionRef} {...rest}>
            {header}
            {children}
        </section>
    )
}

window.addEventListener("scroll", () => {
    let duration = 1.8
    document.querySelectorAll("*[data-animate-section]").forEach((section) => {
        for (let elem of section.children) {
            addAnimation(elem, `${duration}s fade-in ease forwards`)
        }
        section.querySelectorAll("*[data-animation]").forEach((animateElem) => {
            const animation = animateElem.dataset.animation
            addAnimation(animateElem, animation)
        })
    })
})

function addAnimation(elem, cssAnimation) {
    if (onWindow(elem)) {
        if (!fadedIn(elem)) {
            elem.style.animation = cssAnimation
        }
    } else if (fadedIn(elem)) elem.style.animation = ""
}

function onWindow(elem) {
    const yOffsetBot = pageYOffset + window.innerHeight,
          bBorder = elem.offsetTop + elem.offsetHeight,
          tBorder = elem.offsetTop
    return (pageYOffset < bBorder && tBorder < yOffsetBot)
}

function fadedIn(elem) {
    return elem.style.animation //elem.classList.contains("fade-in")
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)