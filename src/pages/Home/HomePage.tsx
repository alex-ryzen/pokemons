import { useState, type FC } from "react";
import style from './homepage.module.css'
import { CollapseProps } from "antd";
import Accordion from "../../components/UI/Accordion/Accordion";
import { Item } from "../../types/app";
import EntityCard, { EntityCardProps} from "../../components/UI/EntityCard/EntityCard";
import MyPokemons from "../../components/MyPokemons/MyPokemons";


type MidItem = {
  key: string,
  title: string;
  content: React.ReactNode;
};

const HomePage = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const miditems: MidItem[] = [
        { key: "1" , title: "My Pokemons", content: <MyPokemons/>},
        { key: "2" , title: "Garden", content: <>Содержимое второго пункта</> },
        { key: "3" , title: "Hunt", content: 
            <>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam magna velit, venenatis eget convallis ut, elementum non metus. Maecenas turpis neque, fermentum at congue ut, rhoncus eu erat. Integer ultricies a nisi et tincidunt. Donec commodo sapien eu nibh tempor, a sodales leo mollis. Integer sollicitudin enim suscipit odio fermentum, vel molestie urna semper. Mauris nisi lectus, feugiat id lacinia quis, placerat eu purus. Aliquam erat volutpat. Integer eu tellus in nibh condimentum maximus. Cras non leo quis sapien imperdiet sodales. Proin scelerisque feugiat nisl a pellentesque. Cras vitae porttitor quam. Donec imperdiet ex non neque pharetra commodo. Vivamus commodo at mauris eget ullamcorper. Duis pretium metus id diam convallis facilisis. Pellentesque sagittis justo ut purus tincidunt aliquet.

                Nulla finibus luctus lorem, ac elementum neque consequat id. Praesent sit amet augue viverra, pulvinar elit eu, imperdiet tortor. Proin facilisis venenatis volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla eu tincidunt ligula. Pellentesque mattis, felis eu aliquet egestas, odio lorem pretium nulla, consequat maximus ex diam sed mi. Etiam posuere ligula sit amet ultricies tincidunt. Duis venenatis dui sed felis fermentum, congue ornare eros bibendum. Nam sit amet tempor quam, id fringilla eros. Donec sed pellentesque massa. Proin congue tempus ante, eget lobortis lectus sodales a.

                Sed commodo magna magna, in pulvinar dolor fermentum vitae. Suspendisse potenti. Phasellus ultricies metus eu eros gravida lobortis. Nullam ut purus erat. Morbi libero felis, faucibus non tincidunt at, malesuada eget ipsum. Praesent eget dui egestas, faucibus metus facilisis, malesuada ipsum. Mauris ex leo, imperdiet ac dolor eu, maximus tristique tortor. Duis sit amet ex in urna eleifend consequat.

                Donec sed massa magna. Duis mattis turpis augue, a cursus neque tincidunt non. Proin sagittis neque id cursus venenatis. Duis mollis, mauris quis mollis dictum, velit ante ullamcorper quam, pharetra hendrerit velit metus et libero. Fusce nec augue id elit fringilla suscipit. Curabitur dapibus egestas commodo. Morbi tristique ullamcorper rhoncus. Nulla dapibus tincidunt purus, non egestas nisl tincidunt cursus. Interdum et malesuada fames ac ante ipsum primis in faucibus. In bibendum erat mi, sed varius tellus pretium ut.

                Morbi interdum ultricies lacinia. Pellentesque in tortor purus. Morbi eu maximus neque. Proin bibendum finibus dapibus. Duis ut tincidunt augue. Vestibulum auctor velit a aliquet rutrum. Morbi efficitur tincidunt scelerisque. Sed non fringilla justo. Nullam vehicula orci eleifend euismod imperdiet. Donec elementum malesuada ipsum quis commodo. Suspendisse viverra odio id tristique varius. Integer mattis justo rhoncus pharetra cursus. Curabitur sodales tellus non pharetra sollicitudin. Sed non dignissim arcu, rhoncus mollis mauris. Cras volutpat gravida lectus, quis ultrices lacus venenatis non. Nulla imperdiet finibus orci vel tincidunt.

                Suspendisse eget turpis pretium, auctor sapien eu, cursus risus. Fusce vel faucibus ante, a aliquet ipsum. Sed ac fringilla metus. Quisque finibus nunc blandit eleifend iaculis. Suspendisse eleifend erat quam, eu dignissim velit finibus quis. Vivamus consectetur pretium pharetra. Nullam nisl mauris, interdum vitae sapien in, ullamcorper sagittis neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

                Nullam vehicula vulputate bibendum. Vestibulum feugiat, nisl eu sodales dapibus, odio velit lobortis odio, vel iaculis massa risus sit amet felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam posuere consectetur dui eu ultrices. Praesent iaculis pellentesque lacinia. Aliquam eu viverra mauris. Aliquam vel est eleifend, rhoncus magna sit amet, scelerisque odio. Aenean auctor pharetra orci id viverra. Morbi rutrum dolor quis placerat dignissim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur vitae pulvinar urna. Maecenas auctor tellus non tellus hendrerit lobortis. Integer vehicula iaculis ornare.
            </> 
        }
    ];

    return ( 
        <div className={style['content-container']}>
            {miditems.map((item, idx) => (
                <Accordion
                    key={item.key}
                    isOpen={openIdx === idx}
                    title={item.title}
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    sectionsCount={miditems.length}
                >
                    {item.content}
                </Accordion>
        ))}
        </div>
    );
}
 
export default HomePage;