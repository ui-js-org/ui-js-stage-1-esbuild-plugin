<!tag @menu ../tags/side-menu.tag>

<!tag @hello-world  ../pages/hello-world.tag>
<!tag @masonry      ../pages/masonry-test.tag>
<!tag @letters      ../pages/letters.tag>


<@menu menu=state.menu @select{ state.selected = event.detail}>
    <@hello-world   if(state.selected?.page === 'hello-world')/>
    <@letters       if(state.selected?.page === 'letters')/>
    <@masonry       if(state.selected?.page === 'masonry')/>
</@menu>


<!state>
    selected: undefined,
    menu: [
        { caption: 'Basics', items: [
            { caption: 'Hello world', page: 'hello-world' },
        ]},
        { caption: 'UI.js demo', items: [
            { caption: 'Letters', page: 'letters' },
            { caption: 'Masonry',     page: 'masonry' },
        ]}
    ]
