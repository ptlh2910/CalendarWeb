class Card {
  constructor(text, place, todoList, id, description, endDate = "") {
    this.place = place;
    this.todoList = todoList;
    this.state = {
      text: text,
      endDate: endDate,
      description: description,
      //mảng gồm đối tượng checklist ntn{ title: "xin chào", checked: "checked", id_checklist:'id' }
      checklist: [],
      comments: [],
      members: [],
    };
    this.id = id;
  }
}
