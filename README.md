# Collections for pres-jmpress presentations

## Installation

```
meteor add djedi:pres-collections
```


## Usage

Simply add these line in your project:
```
{{> Presentation}}
```

NB: `this` should be mapped on presentation object.

This package also manage the presentation'session: the speaker controls the slide and the audience have no control on the presentation flow.


# Collection format

Content are formatted using github flavored markdown.

```
{
  "name": "presentation name",
  "steps": [
    {
      "id": "Step Id",
      "md": "Markdown formatted content",
      "x": "0",
      "y": "0",
      "z": "0",
      "rotateY": "45",
      "rotateZ": "45"
      ... all attributes accepted by pres-jmpress ...
    }
  ]
}
```
