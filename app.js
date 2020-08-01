var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    itemPersentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];

      if (count % 3 == 0) y = y + ".";
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] === ".") z = z.substr(1, z.length - 1);
    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };
  return {
    displayDate: function () {
      var unuudur = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getMonth() + " сарын ";
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function (el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    displayPersentages: function (allPercentages) {
      var element = document.querySelectorAll(DOMstrings.itemPersentageLabel);
      nodeListForEach(element, function (el, index) {
        el.textContent = allPercentages[index] + "%";
      });
    },
    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index, array) {
        array[0].value = "";
        array[1].value = 0;
      });
      fieldsArr[0].focus();
    },
    tusviigUzuuleh: function (tusuv) {
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    addListItem: function (item, type) {
      var html, list;
      // Орлого зарлагын элетентийг агуулсан html-ийг бэлтгэнэ.
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-$$ID$$"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-$$ID$$"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр html дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө.
      html = html.replace("$$ID$$", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatMoney(item.value, type));
      // Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.persentage = -1;
  };
  Expense.prototype.calcPersentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.persentage = Math.round((this.value / totalIncome) * 100);
    } else this.persentage = 0;
  };
  Expense.prototype.getPercentage = function () {
    return this.persentage;
  };
  function calculate(type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  }
  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,
    huvi: 0,
  };
  return {
    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPersentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
    },
    tusviigTootsooloh: function () {
      calculate("inc");
      calculate("exp");

      data.tusuv = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.huvi = 0;
      }
    },
    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    addItem: function (type, desc, value) {
      var item, id;
      if (data.items[type].length === 0) id = 1;
      else id = data.items[type][data.items[type].length - 1].id + 1;

      if (type === "inc") item = new Income(id, desc, value);
      else item = new Expense(id, desc, value);

      data.items[type].push(item);

      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();
var appController = (function (m1, m2) {
  var ctrlAddItem = function () {
    console.log("click hiilee");
    // 1. Оруулах өгөгдлийг дэлгэцнээс олж авна.
    var input = m1.getInput();
    if (input.description !== "" && input.value !== 0) {
      // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
      var item = m2.addItem(input.type, input.description, input.value);
      // 3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана.
      m1.addListItem(item, input.type);
      m1.clearFields();
      updateTusuv();
    }
  };
  var updateTusuv = function () {
    // 4. Төсвийг тооцоолно.
    m2.tusviigTootsooloh();
    // 5. Эцсийн үлдэгдэл,
    var tusuv = m2.tusviigAvah();
    // 6. тооцоог дэлгэцэнд гаргана.
    m1.tusviigUzuuleh(tusuv);
    m2.calculatePercentages();
    var allPercentages = m2.getPercentages();
    m1.displayPersentages(allPercentages);
  };
  var setupEventListener = function () {
    var DOM = m1.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", m1.changeType);
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemID = parseInt(arr[1]);
          // Санхүүгийн модулиас type id ашиглаад устгана.
          m2.deleteItem(type, itemID);
          // Дэлгэц дээрээс энэ элементийг устгана.
          m1.deleteListItem(id);
          // Үлдэгдэл тооцоог шинэчилж харуулна.
          updateTusuv();
        }
      });
  };
  return {
    init: function () {
      m1.displayDate();
      m1.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      return setupEventListener();
    },
  };
})(uiController, financeController);
appController.init();
