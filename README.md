# BlissRecruitment
This solution is just one quick demo for the recruitment process on Bliss:
The database was not created and the Entity project is missing too due missing software and I doen't have time to solve it now.

This exercise would have 3 tables:

CREATE TABLE Question (
    ID int NOT NULL AUTO_INCREMENT,
    question varchar(255) NOT NULL,
    image_url varchar(255),
    thumb_url varchar(255),
    published_at datetime,
    PRIMARY KEY (ID)
);

CREATE TABLE Choices (
    choiceID int NOT NULL PRIMARY KEY,
    choice int NOT NULL,
    votes int NOT NULL,
    questionID int FOREIGN KEY REFERENCES Question(ID)
);

CREATE TABLE SharedLog (
    ID int NOT NULL AUTO_INCREMENT,
    destination_email varchar(255),
    content_url varchar(255),
    published_at datetime,
    PRIMARY KEY (ID)
);
