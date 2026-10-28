let apiData = [];
let contacts = [];
const tbody = document.getElementById('tBody')


async function getUsersdata() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        apiData = await response.json()
        contacts = [...apiData]
        displayContacts(contacts)
    } catch (err) {
        console.log(err)
    }
}

function displayContacts(datas) {
    tbody.innerHTML = "";
    if (datas.length === 0) {
        tBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No contacts found
                </td>
            </tr>`;
        return;
    }
    [...datas].reverse().forEach(data => {
        const row = document.createElement("tr");
        tbody.appendChild(row)
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td><button class="btn btn-primary" onclick = "updateContact(${data.id})">Edit</button>
             <button class="btn btn-danger"  onclick = "deleteContact(${data.id})">Delete</button></td>
        `
    });
}

function addNewContact() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const newContact = {
        id: contacts.length > 0
            ? Math.max(...contacts.map(contact => contact.id)) + 1
            : 1,
        name: name,
        phone: phone,
        email: email
    };

    contacts.push(newContact);
    console.log(contacts)
    displayContacts(contacts);
    const modalEl = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.hide();

}
function updateContact(id) {
    const contact = contacts.find(data => data.id === id);
    if (!contact) return;
    
    document.getElementById('updatename').value = contact.name;
    document.getElementById('updatephone').value = contact.phone;
    document.getElementById('updateemail').value = contact.email;
    document.getElementById('contactId').value = contact.id;

    const modalElement = document.getElementById('UpdateModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function saveChanges() {
    const contactId = Number(
        document.getElementById('contactId').value
    );
    const updatedContact = {
        name: document.getElementById('updatename').value.trim(),
        phone: document.getElementById('updatephone').value.trim(),
        email: document.getElementById('updateemail').value.trim()
    };
    contacts = contacts.map((contact) => {
        if (contact.id === Number(contactId)) {
            return { ...contact, ...updatedContact }
        }
        return contact
    })
    displayContacts(contacts);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('UpdateModal')).hide();
    document.getElementById('contactId').value = '';
}

function deleteContact(id) {
    const index = contacts.findIndex(contact => contact.id === Number(id));
    if (index !== -1) {
        contacts.splice(index, 1);
    }
    displayContacts(contacts);
}

function searchContacts() {
    const keyword = document.getElementById('searchBar').value
    const rows = document.querySelectorAll('#tBody tr');

    rows.forEach((row) => {
        const namesList = row.cells[0] ? row.cells[0].textContent.toLowerCase() : '';
        const phoneList = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
        if (namesList.includes(keyword) || phoneList.includes(keyword)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    })
}

getUsersdata()