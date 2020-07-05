import React from "react"

const IMAGE_STORAGE = "/static/images/"

export function Logo(props) {
    return (
        <h1 className="link-logo"><a href="/">WGarden</a></h1>
    )
}

export function List(props) { 
    const {className = "", items = [], specListItemComponent, ...rest} = props
    const ListUnit = specListItemComponent || ListItem
    return (
        <ul {...rest} className={className}>
            {props.items.map(value => {
                return <ListUnit content={value} key={value.ID}/>
            })}
        </ul>
    )
}

export function ListItem(props) {
    const {content, ...rest} = props
    return (
        <li {...rest}>
            <Article {...content}/>
        </li>
    )
}

export function LinkListItem(props) {
    const {content, ...rest} = props,
          {href, ...articleContent} = content
    return (
        <li {...rest}>
            <a href={href}>
                <Article {...articleContent}/>
            </a>
        </li>
    )
}

export function Article(props) {
    const {title, imageName, text} = props,
          aTitle = title && <h2>{title}</h2>,
          aImage = imageName && <BackgroundImage name={imageName}/>,
          aText  = text && <p>{text}</p>
    return (
        <React.Fragment>
            {aTitle}
            {aImage}
            {aText}
        </React.Fragment>
    )
}

export function Image(props) {
    const {name, className, ...rest} = props
    return <img src={IMAGE_STORAGE + name} className={className} {...rest}/>
}

export function BackgroundImage(props) {
    const className = props.className && props.className + " image-div" || "image-div" 
    return <div style={{"backgroundImage" : `url("${IMAGE_STORAGE}${props.name}")`}} className={className}></div>
}

export function useResponse(path) {
    const [content, setContent] = React.useState("")
    const [isLoaded, setIsLoaded] =  React.useState(false)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const pathName = path
        fetch(pathName, {
            method: "GET"
            }
        ).then(res => res.json()
        ).then(
            response => {
                setContent(response)
                setIsLoaded(true)
            },
            reason => setError(reason)
        )
    }, [])
    return [content, isLoaded, error] 
}

export function ContentHandler(props) {
    const [isLoaded, error] = props.contentState
    if (error) {
        return <div>Произошла ошибка, пожалуйста, попробуйте перезагрузить страницу!{error.message}</div>
    } else if (!isLoaded) {
        return <div>Идет загрузка</div>
    } else { 
        return props.children
    }
}