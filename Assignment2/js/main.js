/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Amir Aminzadeh     Student ID: 126554187        Date: 6/6/2020
*
*
********************************************************************************/ 
let saleData = [];
let page = 1;
const perPage = 10;

let saleTableTemplate = _.template(`<% _.forEach(saleData, function(sales) { %> 
                                    <tr data-id=<%- sales._id %>>
                                        <td><%- sales.customer.email %></td>
                                        <td><%- sales.storeLocation %></td> 
                                        <td><%- sales.items.length %></td> 
                                        <td><%- moment.utc(sales.saleDate).local().format('LLLL') %></td> 
                                    </tr> 
                                    <% }); %>`
);


let saleModelBodyTemplate = _.template(`
    
                                        <h4>Customer</h4>
                                        <strong>email:</strong><%- obj.customer.email %><br>
                                        <strong>age:</strong><%- obj.customer.age %><br>
                                        <strong>satisfaction:</strong><%- obj.customer.satisfaction %>/5

                                        <br><br>
                                        <h4>Items: $<%- obj.total.toFixed(2) %></h4>

                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <% _.forEach(obj.items, function(sales) { %>
                                                    <tr data-id=<%- sales._id %>>
                                                        <td><%- sales.name %></td>
                                                        <td><%- sales.quantity %></td>
                                                        <td>$<%- sales.price %></td>
                                                    </tr>
                                                <% }); %>
                                            </tbody>
                                        </table>`
);


function loadSaleData() {
    fetch(`https://immense-headland-73528.herokuapp.com/api/sales?page= ${page} &perPage= ${perPage}`)
        .then(res => res.json())
        //.then(saleData=>console.log(data))
        .then((data) => {
            saleData = data;
            //let tableData = saleTableTemplate({ sales: saleData })
            let tableData = saleTableTemplate(saleData);
            $("#sale-table tbody").html(tableData);
            $("#current-page").html(page);
        })
};


$(function () {
    loadSaleData();
});


$("#sale-table tbody").on("click", "tr", function (e) {
    let clickedId = $(this).attr("data-id");
    //const found = array1.find(element => condition);
    //let clickedSale = _.find(saleData, [_id == clickedId]);
    let clickedSale = saleData.find(({ _id }) => _id == clickedId);

    clickedSale.total = 0;//To assign a new property to our "clickedSale" called "total"
    //To calculate this value, we can loop through the "items" array in the "clickedSale" 
    //and add up the cost of all items using the formula total += (price * quantity) for every item.
    for (let i = 0; i < clickedSale.items.length; i++) {
        clickedSale.total += clickedSale.items[i].price * clickedSale.items[i].quantity;
    }

    //Once this is done, set the HTML for the modal-title of the "sale-modal" to read "Sale: _id" 
    //where _id is the _id value of the "clickedSale"
    $("#sale-modal h4").html(`Sale: ${clickedSale._id}`);

    //Next, invoke the saleModalBodyTemplate() function with the value of the "clickedSale" 
    //to obtain the full HTML code (as outlined above). Take this HTML and add it 
    //as the content of the modal-body of the "sale-modal".
    $("#modal-body").html(saleModelBodyTemplate(clickedSale));

    //Finally, show the modal by selecting it using jQuery and invoking the .modal() function such that 
    //the user cannot dismiss the modal by hitting "esc" on the keyboard, or clicking on the modal "backdrop".
    $('#sale-modal').modal({
        backdrop: 'static',
        keyboard: false
    });

});

//Wire up a click event for the "previous-page" button
//decrease the value of our global page variable by 1, only if its current value is greater than 1 
//(ie: we do not want to let users access page values lower than 1)
//invoke the loadSaleData() function again, to refresh the "sale-table"
$("#previous-page").on("click", function (e) {
    if (page > 1) {
        page--;
    }
    loadSaleData();
});

//increase the value of our global page variable by 1
$("#next-page").on("click", function (e) {
    page++;
    loadSaleData();
});



