class Broad{
    constructor(place, title = "List", id, idBackground) {
        this.place = place;
        this.state = {
            text: title,
        };
        this.cardArray = [];
        this.id = id;
        this.idBackground = idBackground;
    }
}