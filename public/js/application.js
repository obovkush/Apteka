// Create
// async function handleNewEntry(event) {
//   event.preventDefault();

//   const entry = {
//     title: event.target.title.value,
//     body: event.target.body.value,
//   };

//   const requestBody = JSON.stringify(entry);
//   let response;
//   try {
//     response = await fetch(event.target.action, {
//       method: event.target.method, // "POST"
//       body: requestBody,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.log('data transmission error\n', error);
//   }
//   const json = await response.json();
//   console.log(json);
//   if (json.isCreateSuccessful) {
//     document.location.replace(`/entries/${json.entryId}`);
//   } else {
//     console.log('Error', json.errorMessage);
//   }
// }

// document
//   .newEntryForm
//   ?.addEventListener('submit', handleNewEntry);

// Update
async function handleEditProfile(event) {
  event.preventDefault();

  const user = {
    name: event.target.name.value,
    email: event.target.email.value,
    password: event.target.password.value,
  };

  const requestBody = JSON.stringify(user);
  let response;
  try {
    response = await fetch(event.target.action, {
      method: event.target.method, // "POST"
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('data transmission error\n', error);
  }
  const json = await response.json();
  if (json.isUpdateSuccessful) {
    console.log('Work');
    window.location.replace('/profile');
  } else {
    console.log('Error', json.errorMessage);
  }
}

document
  .editProfileForm
  ?.addEventListener('submit', handleEditProfile);

// Delete
// async function handleDeleteEntry(event) {
//   event.preventDefault();

//   const { entryid } = event.target.dataset;
//   let response;
//   try {
//     response = await fetch(`/entries/${entryid}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.log('data transmission error\n', error);
//   }

//   const json = await response.json();
//   if (json.isDeleteSuccessful) {
//     document.location.replace('/entries');
//   } else {
//     console.log('Error', json.errorMessage);
//   }
// }

// document
//   .querySelector('#deleteEntryButton')
//   ?.addEventListener('click', handleDeleteEntry);
