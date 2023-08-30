const createTask = document.querySelector('#create-task');
const deleteTasks = document.querySelector('#delete');
const cards = document.querySelectorAll('.cards');
const todoCards = cards[0];
const doneCards = cards[1];
const popup = document.querySelector('#popup');
const cancel = document.querySelector('#cancel');
const submit = document.querySelector('#submit');
const url = 'https://todo-app-proxdhiya.onrender.com/'
let popupStatus = false;
let todo = [];
let done = [];

createTask.addEventListener('click', () => {
    if (popupStatus) {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'block';
    }
    popupStatus = !popupStatus;
});

cancel.addEventListener('click', () => {
    popup.style.display = 'none';
    popupStatus = !popupStatus;
});

const createTicketDom = (id, title, isTodo) => {
    const ticket = document.createElement('div');
    ticket.classList.add('ticket');
    ticket.id = id;
    ticket.innerHTML = `<p>${title}</p>`;
    if (isTodo) {
        ticket.addEventListener('click', async (e) => {
            await fetch(`${url}api/done`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            location.reload();
        });
    }
    return ticket;
}

(
    async function () {
        try {
            const todoData = await fetch(`${url}api/todo`);
            todo = await todoData.json();

            const doneData = await fetch(`${url}api/done`);
            done = await doneData.json();

            todo.data.forEach((task) => {
                todoCards.appendChild(createTicketDom(task.id, task.title, true));
            });

            done.data.forEach((task) => {
                doneCards.appendChild(createTicketDom(task.id, task.title, false));
            });
        } catch (err) {
            console.error(err.message);
        }
    }
)(todo, done, createTicketDom);

const submitEvent = async () => {
    const data = popup.querySelector('input').value;
    await fetch(`${url}api/todo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: data })
    });

    location.reload();
}

submit.addEventListener('click', async () => {
    await submitEvent();
});

// button enter click
submit.addEventListener('keyup', async (e) => {
    if (e.keyCode === 13) {
        await submitEvent();
    }
});


deleteTasks.addEventListener('click', async () => {
    // http://localhost:3000/api/done/all
    // method: DELETE
    await fetch(`${url}api/done/all`, {
        method: 'DELETE'
    });

    location.reload();
});
