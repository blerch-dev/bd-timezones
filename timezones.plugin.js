/**
 * @name Timezones
 * @version 0.1.0
 * @description Custom timezones displayed per message.
 * @author blerch
 * @website https://blerch.dev/
*/

module.exports = class Timezones {
    load() {
        
    } // Optional function. Called when the plugin is loaded in to memory

    start() {
        console.log(BdApi);
    } // Required function. Called when the plugin is activated (including after reloads)

    stop() {

    } // Required function. Called when the plugin is deactivated

    observer(changes) {
        //console.log("Timezone Log:", changes);
        this.format_times(changes)

    } // Optional function. Observer for the document.

    options = {
        mode: 1, // 0 is local, 1 is UTC,

        _elems_per_tick: 100
    }

    async format_times(mutation) {
        if(this.options.mode === 0)
            return;

        if(mutation.addedNodes.length > 0) {
            for(let i = 0; i < mutation.addedNodes.length; i++) {
                if(mutation.addedNodes[i]?.children?.length === 0)
                    continue;
                
                let node = mutation.addedNodes[i];
                if(!(node instanceof Element)) {
                    //console.log("Mutation:", mutation)
                    continue;
                }

                //console.log("Node:", node);
                let time_nodes = node?.getElementsByTagName('time');
                if(time_nodes?.length > 0) {
                    this._alter_time_text(time_nodes);
                }
            }
        }
    }

    async _alter_time_text(elems) {
        let counter = 0;
        for(let i = 0; i < elems.length; i++) {
            // Message Type
            let id_args = elems[i].parentElement.getAttribute('class').split('-')[0] === 'timestamp' ? true : false;
            let message_type = id_args ? 0 : 1; // 0 is title, 1 is per message

            // Time
            let elem_tag = elems[i].getAttribute('datetime');
            let date = new Date(elem_tag);
            //console.log(elems[i], elem_tag, date);
            if(message_type === 0) {
                let text = elems[i].textContent;
                let time_diff = Date.now() - date.getTime();
                if(time_diff >= (1000 * 60 * 60 * 24))
                    elems[i].textContent = `${text} | ${date.toUTCString()}`;
                else
                    elems[i].textContent = `${text} | ${this.formatted_utc_time(date)}`;
            } else {
                elems[i].textContent = `${this.formatted_utc_time(date)}`;
            }

            counter += 1;

            if(counter % this.options._elems_per_tick === 0) {
                await this.sleep();
            }
        }
    }

    formatted_utc_time(date) {
        let text = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : `${date.getUTCHours()}`;
        text += date.getUTCMinutes() < 10 ? `:0${date.getUTCMinutes()}` : `:${date.getUTCMinutes()}`;
        text += date.getUTCSeconds() < 10 ? `:0${date.getUTCSeconds()}` : `:${date.getUTCSeconds()}`;

        return text;
    }

    sleep() {
        return new Promise(window.requestAnimationFrame())
    }
}