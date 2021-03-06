const tableActive = document.getElementById('tbl_quest');

function addRow(catQuest,theButton) {
    //muadz: catQuest = 1 means new Category, 0 artinya means new Question.
    currentTr = theButton.parentElement.parentElement;
    currentCatNumb = currentTr.className;

    allTrKategori = tableActive.querySelectorAll(`.${currentCatNumb}`); //muadz: allTrKategori count all tr which in the same category
    latestRowIndex = tableActive.rows[allTrKategori.length].rowIndex; //muadz: latestRowIndex for last rowIndex from current category					
    
    lastTableRow = parseInt(currentTr.rowIndex); //muadz: get rowIndex from current table (which clicked button add)
    if(catQuest === 1 && latestRowIndex + 1 === tableActive.rows.length){ //muadz: new category on last table
        nextId = tableActive.rows.length;
    }else if(catQuest === 1 && latestRowIndex !== tableActive.rows.length - 1){ //muadz: new category in the middle table
        nextId = lastTableRow + latestRowIndex;
    }else{ //muadz: it usually new question, so it must be 1 tr below clicked button
        nextId = lastTableRow + 1;
    }

    //muadz: check if any tr after clicked tr, if any, do restruct
    if(currentTr.nextElementSibling !== null && nextId !== tableActive.rows.length){
        restruct('add',currentTr.nextElementSibling,catQuest,currentCatNumb);
    }

    // for adding tr,td and more.
    var newTR = tableActive.insertRow(nextId);
        newTR.id = `tr_${nextId}`
        newTR.className = catQuest === 1 ? `kategori_${parseInt(currentCatNumb.split('_')[1])+1}` : currentCatNumb;
    
    var newTD = newTR.insertCell(0);
        if(catQuest === 1){
            newTD.innerHTML = `
                <button type='button' onclick="addRow(1,this)" class="button" title="Add">+</button>
                <button type='button' onclick="delRow(1,this)" class="button" title="Minus">-</button>`;
        }

    var newTD = newTR.insertCell(1);
        newTD.innerHTML = `<textarea id="category_name_${nextId}" name="category_name_${nextId}" rows="3"></textarea>`;
    
    var newTD = newTR.insertCell(2);
        if(catQuest === 1){
            newTD.innerHTML = `
                <button type='button' onclick="addRow(0,this)" title="Add">+</button>`;
        }else{
            newTD.innerHTML = `
                <button type='button' onclick="addRow(0,this)" title="Add">+</button>
                <button type='button' onclick="delRow(0,this)" title="Delete">-</button>`;
        }
}

function delRow(catQuest,theButton){
    currentTr = theButton.parentElement.parentElement; //muadz: current tr;
    nextSibling = currentTr.nextElementSibling; //muadz: tr next;
    currentCatNumb = currentTr.className; //muadz: get class from tr, for category;
    rowToDel = 0;

    if(catQuest === 1){
        prevTr = currentTr.previousElementSibling; //muadz: to get prev tr (because current tr is going to be removed)
        // remove all element by className https://stackoverflow.com/a/14066534/2877483
        const elements = document.getElementsByClassName(currentCatNumb);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
            rowToDel++;
        }
        nextSibling = prevTr.nextElementSibling; //muadz: to get next tr after 'prevTr', to make sure any next tr or not
    }else{
        tableActive.removeChild(currentTr);
        rowToDel++;
    }

    //muadz: if any next tr, do restruct
    if(nextSibling !== null){
        restruct('del',nextSibling,catQuest,currentCatNumb);
    }
}

function restruct(action,startElement,catQuest,catNumb){
    //muadz: startElement is first element to do restruct, one tr after current tr.
    startNumb = startElement.rowIndex;
    for(i = startNumb; i < tableActive.rows.length; i++){
        theTr = tableActive.rows[i];
        nextNumber = action === 'add' ? parseInt(i) + 1 : parseInt(i) ;
        //muadz: if next element is question, tr became the same.
        if( catQuest === 1 && catNumb === tableActive.rows[i].className ){
            useNumber = theTr.rowIndex;
        }else{
            useNumber = nextNumber;
        }
        theTr.id = `tr_${useNumber}`;

        //muadz: if group select != null, mean it is category, so can be restructing name and id.
        groupSelect = theTr.querySelector('select');
        if(groupSelect !== null){
            groupSelect.id = groupSelect.name = groupSelect.param = `group_${useNumber}`;
            remarkTextarea = theTr.querySelectorAll('textarea')[1];
            remarkTextarea.id = remarkTextarea.name = `remark_${useNumber}`;
        }

        categoryTextarea = theTr.querySelector('textarea');
        categoryTextarea.id = categoryTextarea.name = `category_name_${useNumber}`;
        
        //muadz: if add/remove is category, restruct the className
        if(catQuest === 1 && catNumb !== tableActive.rows[i].className){
            nextCategory = action === 'add' ? parseInt(theTr.className.split('_')[1]) + 1 : parseInt(theTr.className.split('_')[1]) - 1 ;
            theTr.className = `kategori_${nextCategory}`;
        }
    }
}