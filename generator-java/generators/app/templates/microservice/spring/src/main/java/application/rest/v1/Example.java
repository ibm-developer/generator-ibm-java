package application.rest.v1;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class Example {

  @RequestMapping("v1/example")
  public String example() {
    List<String> list = new ArrayList<>();
    //return a simple list of strings
    list.add("Some data");
    return list.toString();
  }
}
