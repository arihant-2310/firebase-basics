window.alert('Time to hit the boredom, lets chat!!');
const chatList = document.querySelector('#chat-list');
const form = document.querySelector('#add-chat-form');


//create element and render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let message = document.createElement('span');
    let cross = document.createElement('div');
    
    li.setAttribute('data-id',doc.id);

    name.textContent = doc.data().name;
    message.textContent = doc.data().message;
    cross.textContent = 'x';


    li.appendChild(name);
    li.appendChild(message);
    li.appendChild(cross);
   


    chatList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e)=>{
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}
// //getting data
// db.collection('cafes').get().then((snapshot)=>{
//     snapshot.docs.forEach(doc =>{
//         renderCafe(doc);
//     })
// })

//saving data
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        message:form.message.value,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
    });
    form.name.value='';
    form.message.value= '';
})


//real time data
db.collection('cafes').orderBy('timestamp','asc').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change=>{
        if(change.type=='added'){
            renderCafe(change.doc);
        }
        else if(change.type=='removed'){
            let li = chatList.querySelector('[data-id='+ change.doc.id + ']');
            chatList.removeChild(li);
        }
    })
})
