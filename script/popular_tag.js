let popular=["banhchung","xuan","tet","mienbac","banhtet","miennam"]
let food = ["banhchung","banhtet","banhxeo","banhmi","bahcan","thanhlong"]
let travel = ["saigon","hochiminh","hanoi","mienbac","danang","miennam"]
let poptag = document.getElementById("popular")
let foodtag = document.getElementById("food")
let traveltag = document.getElementById("travel")
popular.forEach(pop=>{
    let l = document.createElement("a")
    let tag = document.createElement("div")
    tag.classList.add("chip")
    tag.innerHTML=pop
    l.appendChild(tag)
    l.setAttribute("href",`/search?search_key=${pop}`)
    poptag.appendChild(l)
})
food.forEach(pop=>{
    let l = document.createElement("a")
    let tag = document.createElement("div")
    tag.classList.add("chip")
    tag.innerHTML=pop
    l.appendChild(tag)
    l.setAttribute("href",`/search?search_key=${pop}`)
    foodtag.appendChild(l)
})
travel.forEach(pop=>{
    let l = document.createElement("a")
    let tag = document.createElement("div")
    tag.classList.add("chip")
    tag.innerHTML=pop
    l.appendChild(tag)
    l.setAttribute("href",`/search?search_key=${pop}`)
    traveltag.appendChild(l)
})