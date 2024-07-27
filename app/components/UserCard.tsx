import '../styles/deleteBtn.css'

const UserCard = ({src, username, }: { src: string, username: string, }) => {
    // const fetcher = useFetcher()
    // const deleteAccount = () => {
    //     const formData = new FormData();
    //     formData.append('formType', 'deleteAccount');
    //     formData.append('username', username)
    //     fetcher.submit(formData, {method: "POST", action: "/profile"});
    // };
    return (
        <>
            <h1 style={{textAlign: "center"}}>
                <span>Hey {username}</span>
            </h1>
            <div className="userCardContainer">
                <article className={'userCard'}>
                    <header className="header">
                        <div className="pfp-container">
                            <img className="pfp" src={src} alt={`${src} avatar`}/>
                        </div>
                        <form method="POST" action="/app/routes/profile" encType="multipart/form-data">
                            <input type="file" id="myFile" name="filename"/>
                            <input type="submit" value="Update profile pic"/>
                        </form>
                    </header>
                    <p style={{textAlign: "center"}}>You have added 5 so far!</p>
                    <footer style={{display: 'flex', justifyContent: 'center'}}>
                        <span data-tooltip="You'll lose your acccount once clicked this button"
                              data-placement="top">
                            <button style={{backgroundColor: " #e62222"}} className="noselect">
                                <span className="text">Delete</span>
                                <span className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                  d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                            </svg>
                          </span>
                            </button>
                        </span>
                    </footer>
                </article>
            </div>
        </>
    )
}
export default UserCard;