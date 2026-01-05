const API = 'http://localhost:8080';

function loadRooms() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('list').innerHTML = '';
    
    fetch(API + '/rooms', {
        headers: getAuthHeaders()
    })
        .then(res => {
            document.getElementById('loading').style.display = 'none';
            if (!res.ok) {
                if (res.status === 401) {
                    logout();
                    return;
                }
                throw new Error('Failed to load rooms');
            }
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                document.getElementById('list').innerHTML = '<p class="loading">No rooms available. Add some rooms to get started!</p>';
                return;
            }
            
            const rows = data.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td>${escapeHtml(r.type)}</td>
                    <td>$${r.price}</td>
                    <td>
                        <button class="action-btn edit" onclick="editRoom(${r.id}, '${escapeHtml(r.type)}', ${r.price})">✏️ Edit</button>
                        <button class="action-btn danger" onclick="deleteRoom(${r.id})">🗑️ Delete</button>
                    </td>
                </tr>
            `).join('');

            document.getElementById('list').innerHTML = `
                <table class="room-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Room Type</th>
                            <th>Price per Night</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>`;
        })
        .catch(e => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('list').innerHTML = `<p class="error-message" style="display: block;">Error: ${e.message}</p>`;
        });
}

function saveRoom() {
    const id = document.getElementById('roomId').value;
    const type = document.getElementById('type').value;
    const price = parseFloat(document.getElementById('price').value || 0);

    const payload = { type, price };
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
    };

    if (id) {
        // update
        fetch(API + '/rooms/' + id, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    logout();
                    return;
                }
                throw new Error('Failed to update room');
            }
            clearForm(); 
            loadRooms();
        }).catch(e => alert('Error: ' + e.message));
    } else {
        // create
        fetch(API + '/rooms', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    logout();
                    return;
                }
                throw new Error('Failed to create room');
            }
            clearForm(); 
            loadRooms();
        }).catch(e => alert('Error: ' + e.message));
    }
}

function editRoom(id, type, price) {
    document.getElementById('roomId').value = id;
    document.getElementById('type').value = type;
    document.getElementById('price').value = price;
}

function deleteRoom(id) {
    if (!confirm('Delete room id=' + id + '?')) return;
    fetch(API + '/rooms/' + id, { 
        method: 'DELETE',
        headers: getAuthHeaders()
    })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    logout();
                    return;
                }
                throw new Error('Failed to delete room');
            }
            return res.json();
        })
        .then(() => loadRooms())
        .catch(e => alert('Error: ' + e.message));
}

function clearForm() {
    document.getElementById('roomId').value = '';
    document.getElementById('type').value = '';
    document.getElementById('price').value = '';
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
