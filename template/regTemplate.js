

const regTemplate = (name,email) => {
    return `<div> 
            <h1 style="color:slateblue;"> Hi, ${name} Welcome to CMS-v1.0</h1>
            <article style="margin:auto; object-fit:cover;">

            <img src="https://e7.pngegg.com/pngimages/300/474/png-clipart-shake-hands-animation-services-marketing-video-shake-hands-miscellaneous-hand-thumbnail.png" width="300" height="300"/>
            <h4> We are excited to have you get started with mail id = 
            <span style="color:orangered;">${email} </span>,   you account is ready to use.</h4>
            </article>

    </div>`

}

module.exports = regTemplate