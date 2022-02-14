async function newPost(event){
    event.preventDefault()

    const title = document.querySelector('input[name="post-title"]').value;
    const text = document.querySelector('textarea[name="post-text"]').value;
    const post = JSON.stringify({title,text})
    console.log(post)

    const response = await fetch('/api/posts', {
        method: 'post', 
        body: JSON.stringify({
            title,
            text
        }),
        headers:{ 'Content-Type' : 'application/json'}
    })

    if(response.ok){
        document.location.replace('/dashboard')
    }else{
        alert(response.statusText)
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newPost)