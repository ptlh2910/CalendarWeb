class List{
    constructor(place, title = "List", id) {
        this.place = place;
        this.state = {
            text: title,
        };
        this.cardArray = [];
        this.id = id;
    }
}
