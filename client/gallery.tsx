// 1. Import React Library
import * as React from "react";
import ReactDOM from "react-dom";

// 2. Import our Data
import Data from "./script/Data";

let main = () => {
    ReactDOM.render(
        <Gallery images={Data} />, 
        document.getElementById("galleryContainer")
    );
};

type Image = {
    src: string,
    thumbSrc: string,
    caption: string
}

type GalleryProps = {
    images: Image[]
}

type GalleryState = {
    selected: Image
}

class Gallery extends React.Component<GalleryProps, GalleryState> {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.images[0]
        };
    }

    render() {
        return <div className="gallery">
            <ul className="gallery__master">{
                this.props.images.map((image) => {
                    return <Thumbnail key={image.src}
                                      image={image} 
                                      selected={(image.src === this.state.selected.src) ? true : false}
                                      onSelect={(image) => this.selectedHandler(image)}/>
                })
            }</ul>
            <div className="gallery__detail">
                <div className="gallery__detail-img-wrap">
                    <img className="gallery__detail-img"
                        src={this.state.selected.src}></img>
                </div>
            </div>            
            <div className="gallery__caption">
                {this.state.selected.caption}
            </div>
        </div>;
    }

    selectedHandler(image: Image): void {
        this.setState({
            selected: image
        });
    }
}

type ThumbnailProps = {
    image: Image,
    selected: boolean,
    onSelect?: (image: Image) => void,
}

class Thumbnail extends React.Component<ThumbnailProps> {
    render() {
        return <li 
                    className={(this.props.selected) ? "gallery__thumb selected" : "gallery__thumb"}
                    onClick={() => this.clickHandler()}
                >
            <div className="gallery__thumb-img-wrap">
                <img className="gallery__thumb-img" 
                    src={this.props.image.thumbSrc} />
            </div>
        </li>;
    }

    clickHandler() {
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(this.props.image);
        }
    }
}

window.addEventListener("load", main);
