import {FaGithub} from "react-icons/fa";

export const Footer = () => {
    return (
        <div className={'footer'}>
            <p className={"footerLink"}><a style={{textDecoration: "none"}}
                                           href="https://github.com/rohit20v/film-ranking">Github <FaGithub style={{marginBottom: "4px"}}/></a></p>
            <p className={"footerLink"}>
                <a style={{textDecoration: "none", display: "flex", gap: 8, alignItems: "center"}}
                   href="https://www.omdbapi.com/">
                    OMDB
                    <p
                        style={{fontSize: "small", marginTop: "25px"}}>for posters
                    </p>
                </a>
            </p>
        </div>
    );
};