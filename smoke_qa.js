(async () => {
  const base = 'https://tp05-backend-qa-chdtg5exgzarc7hd.brazilsouth-01.azurewebsites.net';
  const rnd = Date.now();
  const name = `smoke_${rnd}`;
  const email = `${name}@example.com`;

  function logTitle(t){ console.log('\n--- ' + t + ' ---'); }
  async function dump(res){
    const status = res.status || res.statusCode;
    let body;
    try { body = await res.json(); } catch(e){ body = await res.text(); }
    console.log('Status:', status);
    console.log('Body:', JSON.stringify(body, null, 2));
    return body;
  }

  try{
    logTitle('GET /users (before)');
    let r = await fetch(base + '/users');
    await dump(r);

    logTitle('POST create');
    r = await fetch(base + '/users', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email })
    });
    const created = await dump(r);

    const id = created && created.id;

    logTitle('POST duplicate (expect error)');
    r = await fetch(base + '/users', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email: name + 'dup@example.com' })
    });
    await dump(r);

    if(id){
      logTitle('PUT update');
      r = await fetch(base + '/users/' + id, {
        method: 'PUT', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: name + '-upd', email: name + '-upd@example.com' })
      });
      await dump(r);

      logTitle('DELETE');
      r = await fetch(base + '/users/' + id, { method: 'DELETE' });
      console.log('Status (delete):', r.status);
    }

    logTitle('GET /users (after)');
    r = await fetch(base + '/users');
    await dump(r);

    console.log('\nSmoke tests completed.');
  } catch (err){
    console.error('Error running smoke tests:', err);
    process.exit(1);
  }
})();
