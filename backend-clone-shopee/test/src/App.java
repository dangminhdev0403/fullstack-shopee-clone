import java.util.ArrayList;
import java.util.List;

public class App {
    public static void main(String[] args) throws Exception {
        // System.out.println("Ten cua ban la gi?");
        String string = "Van Minh";
        String arr[] = string.split("");
        List<String> n = new ArrayList<>();
        for (int i = 0; i < string.length(); i++) {
            n.add(arr[i]);
        }

        n.sort((a, b) -> a.length() - b.length());

        for (int i = n.size() - 1; i >= 0; i--) {
            System.out.print(n.get(i));
        }

    }
}
