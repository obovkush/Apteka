async function addToBasket(event) {
  event.preventDefault();
  if (event.target.classList.contains('jsBtn')) {
    console.log('click', event.target.dataset.id);

    const id = {
      id: event.target.dataset.id,
    };

    await fetch('/addToBasket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    });
  }
}

async function addPromoToBasket(event) {
  event.preventDefault();
  if (event.target.classList.contains('btn')) {
    console.log('click', event.target.dataset.id);

    const id = {
      id: event.target.dataset.id,
    };

    await fetch('/addToBasket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    });
  }
}

async function getOrder(event) {
  event.preventDefault();
  if (event.target.classList.contains('orderBtn')) {
    // console.log(event.target.dataset.total);
    const total = {
      total: event.target.dataset.total,
    };

    const response = await fetch('/addToOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(total),
    });

    window.location.href = '/order';
  }

  if (event.target.classList.contains('jsMinus')) {
    // console.log('minus', event.target.dataset.idm);

    const minus = {
      id: event.target.dataset.idm,
    };

    const response2 = await fetch('/minus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minus),
    });

    const minusHTML = await response2.text();
    document.querySelector('.js-order').innerHTML = minusHTML;
  }

  if (event.target.classList.contains('jsPlus')) {
    console.log('plus', event.target.dataset.idp);
    const plus = {
      id: event.target.dataset.idp,
    };

    const response3 = await fetch('/plus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plus),
    });
    const plusHTML = await response3.text();
    document.querySelector('.js-order').innerHTML = plusHTML;
  }
}

async function findDrugs(event) {
  event.preventDefault();
  console.log('find');
  const data = {
    name: event.target.nameDrug.value,
  };

  const response4 = await fetch('/drug/id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log(data);
  const id = await response4.text();
  console.log(id);
  if (id === 'not') {
    window.location.href = '/drugs/undef';
  } else {
    window.location.href = `/drugs/${id}`;
  }
  // document.querySelector('.bodyindex').innerHTML = html;
}

document.querySelector('.carousel-inner')?.addEventListener('click', addPromoToBasket);

document.querySelector('.allCards')?.addEventListener('click', addToBasket);

document.querySelector('.js-order')?.addEventListener('click', getOrder);

document.jsFind?.addEventListener('submit', findDrugs);
