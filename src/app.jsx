import React from "react"
import ReactDOM from "react-dom"
import { SocialIcon } from 'react-social-icons';
import {List, ListItem, LinkListItem, 
        ContentHandler, Article, BackgroundImage, 
        useResponse, usePreloadImages} from "./base"

function App(props) {
    const [response, isLoaded, error] = useResponse("./static/main.json")
    return (
        <ContentHandler contentState={[isLoaded, error]}>
            <div className="content_container">
                <Intro content={response.intro}/>
                <Projects content={response.projects}/>
                <Connection content={response.connection}/>
                <Reviews content={response.reviews}/>
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
    const content = props.content
    const showDuration = 4000, hideAnimationDur = 2000
    const [coming, setComing]     = React.useState(content[0])
    const [outgoing, setOutgoing] = React.useState(null)
    usePreloadImages(content)
    React.useEffect(() => {
        setTimeout(showNext, showDuration + hideAnimationDur)
    }, [coming])
    function showNext() {
        setOutgoing(coming)
        setComing(getValidProject(content, coming))
        setTimeout(() => setOutgoing(null), hideAnimationDur)
    }
    const style  = {"animationDuration": `${hideAnimationDur}ms`}
    const newImg = <Slide className="new-slide" content={coming} key={coming.id} style={style}/>,
          oldImg = <Slide className="old-slide" content={outgoing && outgoing} style={style}/>
    return (
        <div>
            {outgoing && oldImg}
            {newImg}
        </div>
    )
}

function Slide(props) {
    const {content, className, ...rest} = props
    return (
        <div className={`${className} slide`} {...rest}>
            <BackgroundImage name={content.imageName}/>
            <div className={"text"}><Article title={content.title} text={content.text}/></div>
        </div>
    )
}

function getValidProject(related_content, lastShowedProject) {
    const lastPIndex = related_content.length - 1
    const indexOfCurr = related_content.indexOf(lastShowedProject)
    return indexOfCurr == lastPIndex ? related_content[0] : related_content[indexOfCurr + 1]
}

function Connection(props) {
    const content = props.content || {}
    const relatedContent = content.relatedContent || []
    return (
        <Section title={content.title} className="connection">
            <List items={relatedContent} specListItemComponent={SocialsContainer}/>
            <div><BackgroundImage className="cake" name="cake5.svg"/></div>
        </Section>
    )
}

function SocialsContainer(props) {
    const content = props.content
    return (
        <li>
            <SocialIcon url={content.url} style={{ height: "4em", width: "4em" }}/>
            <p>{content.url}</p>
        </li>
    )
}

function Reviews(props) {
    const content = props.content
    const relatedContent = content.relatedContent
    return (
        <Section title={content.title} className="reviews">
            <List items={relatedContent}/>
            <ReviewsBack/>
        </Section>
    )
}

function ReviewsBack(props) {
    function getStyle(bottom, right, rotate) {
        return {
            "transform": `rotateZ(${rotate}deg) scale(0.5)`,
            "bottom": `${bottom}%`,
            "right": `${right}%`
        }
    }
    return (
        <div className="reviews-bg-wrap">
            <div className="reviews-bg">
                <BackgroundImage className="cake" name="cake3.svg" style={getStyle(400, 5, -15)}/>
                <BackgroundImage className="cake" name="cake2.svg" style={getStyle(200, 70, 35)}/>
                <BackgroundImage className="cake" name="cake1.svg" style={getStyle(-5, -5, -5)}/>
            </div>
        </div>
    )
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