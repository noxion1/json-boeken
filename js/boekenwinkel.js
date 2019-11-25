//Import JSON
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        soortBookObj.data = JSON.parse(this.responseText);
        soortBookObj.addJSdate();

        //Capital the first letter of the data and sort on that
        soortBookObj.data.forEach(book => {
            book.titelUpper = book.titel.toUpperCase();
            //also add the (last)name as attribute
            book.sortAuthor = book.auteur[0];
        });
        soortBookObj.sort();
    }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();


const createTableHead = (arr) => {
    let head = "<table class='bookSelection'><tr>";
    arr.forEach((item) => {
        head += "<th>" + item + "</th>";
    });
    head += "</tr>";
    return head;
}

const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":
            number = 0;
            break;
        case "februari":
            number = 1;
            break;
        case "maart":
            number = 2;
            break;
        case "april":
            number = 3;
            break;
        case "mei":
            number = 4;
            break;
        case "juni":
            number = 5;
            break;
        case "juli":
            number = 6;
            break;
        case "augustus":
            number = 7;
            break;
        case "september":
            number = 8;
            break;
        case "oktober":
            number = 9;
            break;
        case "november":
            number = 10;
            break;
        case "december":
            number = 11;
            break;
        default:
            number = 0;
    }
    return number;
}

const changeJSdate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const maakOpsomming = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        switch (i) {
            case array.length - 1:
                string += array[i];
                break;
            case array.length - 2:
                string += array[i] + " en ";
                break;
            default:
                string += array[i] + " , ";
        }
    }
    return string;
}

//Put the text after , at the front
const reverseText = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

//object boeken uitvoeren en sorteren en data
let soortBookObj = {
    data: "",

    kenmerk: "titelUpper",

    oplopend: 1,

    addJSdate: function () {
        this.data.forEach((item) => {
            item.jsDatum = changeJSdate(item.uitgave);
        });
    },

    //data sort
    sort: function () {
        this.data.sort((a, b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend);
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        //first empty the id = 'uitvoer'
        document.getElementById('uitvoer').innerHTML = "";

        data.forEach(book => {
            let section = document.createElement('section');
            section.className = 'bookSelection';

            //main element with all the info except the price and cover
            let main = document.createElement('main');
            main.className = 'bookSelection__main';

            //create book cover
            let image = document.createElement('img');
            image.className = 'bookSelection__cover';
            image.setAttribute('src', book.cover);
            image.setAttribute('alt', reverseText(book.titel));

            //create book title
            let title = document.createElement('h3');
            title.className = 'bookSelection__titel';
            title.textContent = reverseText(book.titel);

            //auteurs toevoegen
            let authors = document.createElement('p');
            authors.className = 'bookSelection__auteurs';
            book.auteur[0] = reverseText(book.auteur[0]);
            authors.textContent = maakOpsomming(book.auteur);

            //prijs toevoegen
            let price = document.createElement('div');
            price.className = 'bookSelection__prijs';
            price.textContent = '€ ' + book.prijs;

            //elementen toevoegen
            section.appendChild(image);
            main.appendChild(title);
            main.appendChild(authors);
            section.appendChild(main);
            section.appendChild(price);
            document.getElementById('uitvoer').appendChild(section);
        });

    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    soortBookObj.kenmerk = e.target.value;
    soortBookObj.sort();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        soortBookObj.oplopend = parseInt(e.target.value);
        soortBookObj.sort();
    });
});
